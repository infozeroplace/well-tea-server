import mongoose from 'mongoose';
import Cart from '../model/cart.model.js';
import ShippingMethod from '../model/shippingMethod.js';
import TempOrder from '../model/tempOrder.model.js';
import User from '../model/user.model.js';
import generateOrderId from './generateOrderId.js';

const { ObjectId } = mongoose.Types;

const pipeline = [
  {
    $lookup: {
      from: 'products',
      let: { productIds: '$items.productId' }, // Pass product IDs
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ['$_id', '$$productIds'] }, // Match product IDs
                { $eq: ['$isPublished', true] }, // Only published products
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'media', // Assuming your media collection is named "media"
            localField: 'thumbnails',
            foreignField: '_id',
            as: 'thumbnails',
          },
        },
        {
          $group: {
            _id: '$_id',
            urlParameter: { $first: '$urlParameter' },
            title: { $first: '$title' },
            thumbnails: { $first: '$thumbnails' },
            isSale: { $first: '$isSale' },
            isSubscription: { $first: '$isSubscription' },
            isMultiDiscount: { $first: '$isMultiDiscount' },
            sale: { $first: '$sale' },
            subscriptionSale: { $first: '$subscriptionSale' },
            multiDiscountQuantity: { $first: '$multiDiscountQuantity' },
            multiDiscountAmount: { $first: '$multiDiscountAmount' },
            unitPrices: { $first: '$unitPrices' },
            subscriptions: { $first: '$subscriptions' },
          },
        },
        {
          $addFields: {
            unitPrices: {
              $map: {
                input: '$unitPrices',
                as: 'unitPrice',
                in: {
                  _id: '$$unitPrice._id',
                  unit: '$$unitPrice.unit',
                  price: '$$unitPrice.price',
                  salePrice: {
                    $cond: {
                      if: '$isSale',
                      then: {
                        $round: [
                          {
                            $subtract: [
                              '$$unitPrice.price',
                              {
                                $multiply: [
                                  '$$unitPrice.price',
                                  { $divide: ['$sale', 100] },
                                ],
                              },
                            ],
                          },
                          2,
                        ],
                      },
                      else: 0,
                    },
                  },
                  subscriptionPrice: {
                    $cond: {
                      if: '$isSubscription',
                      then: {
                        $round: [
                          {
                            $subtract: [
                              '$$unitPrice.price',
                              {
                                $multiply: [
                                  '$$unitPrice.price',
                                  { $divide: ['$subscriptionSale', 100] },
                                ],
                              },
                            ],
                          },
                          2,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
        },
      ],
      as: 'productData',
    },
  },
  {
    $addFields: {
      items: {
        $map: {
          input: '$items',
          as: 'item',
          in: {
            $mergeObjects: [
              '$$item',
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$productData',
                      as: 'prod',
                      cond: { $eq: ['$$prod._id', '$$item.productId'] },
                    },
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    $project: {
      productData: 0,
    },
  },
];

const calcItems = payload => {
  const data = {
    ...payload,
    totalPrice: 0,
    totalQuantity: 0,
  };

  const updatedItems = data.items.map(
    ({
      productId,
      unitPriceId,
      unitPrices,
      subscriptionId,
      subscriptions,
      thumbnails,
      title,
      urlParameter,
      purchaseType,
      quantity,
      addedAt,
      isSale,

      isMultiDiscount,
      multiDiscountQuantity,
      multiDiscountAmount,
    }) => {
      const unitPrice = {
        ...unitPrices.find(i => i._id.toString() === unitPriceId),
      };

      const price =
        purchaseType === 'one_time'
          ? isSale
            ? Number(unitPrice.salePrice.toFixed(2))
            : Number(unitPrice.price.toFixed(2))
          : Number(unitPrice.subscriptionPrice.toFixed(2));

      const tPrice = price * quantity;
      const subtractPrice = isMultiDiscount
        ? quantity >= multiDiscountQuantity
          ? multiDiscountAmount
          : 0
        : 0;

        const totalPrice = Number((tPrice - subtractPrice).toFixed(2));

      const unit = unitPrice.unit;

      const subscription =
        subscriptions.find(i => i._id.toString() === subscriptionId)?.weeks ||
        '';

      const thumbnail = {
        filepath: thumbnails[0].filepath,
        alternateText: thumbnails[0].alternateText,
      };

      const newItem = {
        thumbnail,
        title,
        productId,
        unitPriceId,
        subscriptionId,
        subscription,
        purchaseType,
        urlParameter,
        unit,
        price,
        quantity,
        totalPrice,
        addedAt,
      };

      data.totalPrice += totalPrice;
      data.totalQuantity += quantity;

      return newItem;
    },
  );

  data.items = updatedItems;

  return data;
};

const createTempOrder = async (payload, userId) => {
  const { email, cartId, billingAddress, shippingAddress, shippingMethodId } =
    payload;

  let user = null;
  if (userId) {
    user = await User.findOne({ userId });
  }

  const pipelines = [
    {
      $match: {
        _id: new ObjectId(cartId),
      },
    },
    ...pipeline,
  ];

  const { docs } = await Cart.aggregatePaginate(pipelines);

  const cartData = calcItems(docs[0]);

  const shippingMethod = await ShippingMethod.findOne({
    'methods._id': shippingMethodId,
  });

  const method = shippingMethod.methods.find(
    m => m._id.toString() === shippingMethodId,
  );

  const items = cartData.items;
  const subtotal = Number(cartData?.totalPrice.toFixed(2)) || 0;
  const shipping = Number(method?.cost.toFixed(2)) || 0;
  const total = Number((subtotal + shipping).toFixed(2));

  const orderId = await generateOrderId();

  const orderData = {
    email: email || '',
    orderId,
    user: user ? user._id : user,
    cart: new ObjectId(cartId),
    shippingMethod: new ObjectId(shippingMethodId),
    shippingAddress,
    billingAddress,
    customerType: user ? 'user' : 'guest',
    subtotal,
    shipping,
    total,
    items,
  };

  const isItemsExists = items.length > 0;

  if (isItemsExists) {
    await TempOrder.create(orderData);
  }

  return {
    email: email || '',
    firstName: shippingAddress?.firstName || '',
    lastName: shippingAddress?.lastName || '',
    total,
    orderId,
    shippingMethodId,
    isItemsExists,
  };
};

export default createTempOrder;
