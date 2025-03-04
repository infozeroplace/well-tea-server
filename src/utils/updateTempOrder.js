import mongoose from 'mongoose';
import Cart from '../model/cart.model.js';
import Coupon from '../model/coupon.model.js';
import ShippingMethod from '../model/shippingMethod.js';
import TempOrder from '../model/tempOrder.model.js';
import User from '../model/user.model.js';

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

const updateTempOrder = async (payload, orderId, userId) => {
  const {
    email,
    coupon = '',
    billingAddress,
    shippingAddress,
    shippingMethodId,
  } = payload;

  let user = null;
  if (userId) {
    user = await User.findOne({ userId });
  }

  const tempOrder = await TempOrder.findOne({ orderId });

  const existingCoupon = await Coupon.findOne({ coupon });

  const pipelines = [
    {
      $match: {
        _id: tempOrder.cart,
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
    m => m._id.toString() === shippingMethodId.toString(),
  );

  const items = cartData.items;
  const subtotal = Number(cartData?.totalPrice.toFixed(2)) || 0;
  const shipping = Number(method?.cost.toFixed(2)) || 0;
  const discount = Number(existingCoupon?.discount.toFixed(2)) || 0;
  const total = Number((subtotal + shipping - discount).toFixed(2));

  const updatedOrder = {
    user: user ? user._id : user,
    customerType: user ? 'user' : 'guest',
    email,
    coupon: existingCoupon?.coupon || '',
    billingAddress,
    shippingAddress,
    shippingMethod: shippingMethodId,
    subtotal,
    shipping,
    total,
    items,
  };

  await TempOrder.findOneAndUpdate(
    { orderId },
    {
      $set: updatedOrder,
    },
  );

  return {
    total,
  };
};

export default updateTempOrder;
