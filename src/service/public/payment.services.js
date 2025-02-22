import mongoose from 'mongoose';
import { stripe } from '../../app.js';
import config from '../../config/index.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import Address from '../../model/address.model.js';
import Cart from '../../model/cart.model.js';
import ShippingMethod from '../../model/shippingMethod.js';
import User from '../../model/user.model.js';

const { ObjectId } = mongoose.Types;

const endpointSecret = config.stripe_endpoint_secret_key;

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
            ? unitPrice.salePrice
            : unitPrice.price
          : unitPrice.subscriptionPrice;

      const tPrice = price * quantity;
      const subtractPrice = isMultiDiscount
        ? quantity >= multiDiscountQuantity
          ? multiDiscountAmount
          : 0
        : 0;

      const totalPrice = tPrice - subtractPrice;

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

const createPaymentIntent = async (payload, token) => {
  const { cartId, shippingAddressId, shippingMethodId } = payload;

  const verifiedToken = jwtHelpers.verifiedToken(
    token,
    config?.jwt?.refresh_secret,
  );

  if (verifiedToken) {
    const user = await User.findOne({ userId: verifiedToken.userId });

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

    const totalPrice = cartData.totalPrice + method.cost;

    const shippingAddress = await Address.findById(shippingAddressId);

    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'gbp',
      amount: Math.round(totalPrice * 100),
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        email: user.email,
      },
      receipt_email: user.email,
    });

    return paymentIntent.client_secret;
  }
};

const handleWebhookEvent = async (data, sig) => {
  const event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
  const session = event?.data?.object;
  const { metadata, id } = session;

  const { email } = metadata;
  
  if (event.type === 'payment_intent.succeeded') {
  console.log('payment_intent.succeeded')
    // if (orderType === 'general-order') {
    //   const tempGeneralOrder = await TemporaryOrder.findOne({ orderId }).lean();
    //   await createOrder({
    //     ...tempGeneralOrder,
    //     paymentIntentId: id,
    //   });
    //   await TemporaryOrder.deleteOne({ orderId });
    // }
    return;
  } else if (event.type === 'payment_intent.payment_failed') {
    // await TemporaryOrder.deleteOne({ orderId });
    return;
  } else if (event.type === 'payment_intent.canceled') {
    // await TemporaryOrder.deleteOne({ orderId });
    return;
  }
};

export const PaymentService = {
  createPaymentIntent,
  handleWebhookEvent,
};
