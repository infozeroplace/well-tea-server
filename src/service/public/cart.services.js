import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import updateCart from '../../helper/updateCart.js';
import Cart from '../../model/cart.model.js';
import User from '../../model/user.model.js';
import genCartId from '../../utils/genCartId.js';

const addToCart = async (req, res) => {
  const { wtc_id, auth_refresh } = req.cookies;
  const {
    productId,
    actionType,
    purchaseType,
    quantity,
    unitPriceId,
    subscriptionId,
  } = req.body;

  let userId = null;
  let guestId = wtc_id;

  if (auth_refresh) {
    // ✅ Decode the refresh token to get the user ID
    const decoded = jwtHelpers.verifiedToken(
      auth_refresh,
      config?.jwt?.refresh_secret,
    );

    const user = await User.findOne({ userId: decoded?.userId });

    userId = user._id;
  }

  // ✅ If user is logged in, merge guest cart into user cart
  if (userId) {
    let userCart = await Cart.findOne({ userId });

    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });

      if (guestCart) {
        if (!userCart) {
          userCart = new Cart({ userId, items: guestCart.items });
        } else {
          guestCart.items.forEach(guestItem => {
            const existingItem = userCart.items.find(
              item =>
                item.productId.toString() === guestItem.productId.toString() &&
                item.purchaseType === guestItem.purchaseType &&
                item.unitPriceId?.toString() ===
                  guestItem.unitPriceId?.toString() &&
                (item.subscriptionId?.toString() || '') ===
                  (guestItem.subscriptionId?.toString() || ''),
            );

            if (existingItem) {
              existingItem.quantity += guestItem.quantity; // Merge quantities
            } else {
              userCart.items.push(guestItem);
            }
          });
        }

        await userCart.save();
        await Cart.deleteOne({ guestId });

        res.clearCookie('wtc_id', {
          domain: config.cookie_domain,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }
    }

    return updateCart(
      userCart,
      productId,
      actionType,
      purchaseType,
      quantity,
      unitPriceId,
      subscriptionId,
    );
  }

  // ✅ Guest Cart Logic
  if (!guestId) {
    guestId = await genCartId();
    await Cart.create({
      guestId,
      items: [
        { productId, purchaseType, quantity, unitPriceId, subscriptionId },
      ],
    });

    res.cookie('wtc_id', guestId, {
      domain: config.cookie_domain,
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Item added to cart' };
  }

  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart) throw new ApiError(httpStatus.FORBIDDEN, 'Cart not found');

  return updateCart(
    guestCart,
    productId,
    actionType,
    purchaseType,
    quantity,
    unitPriceId,
    subscriptionId,
  );
};

const wtc = async (req, res) => {
  const { wtc_id, auth_refresh } = req.cookies || {};

  let userId = null;
  let guestId = wtc_id;

  const commonPipelines = [
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

  if (auth_refresh) {
    // ✅ Decode the refresh token to get the user ID
    const decoded = jwtHelpers.verifiedToken(
      auth_refresh,
      config?.jwt?.refresh_secret,
    );

    const user = await User.findOne({ userId: decoded?.userId });

    userId = user._id;
  }

  if (userId) {
    // ✅ User is logged in – find their cart
    let userCart = await Cart.findOne({ userId });

    // ✅ If the user has a guest cart, merge it
    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });

      if (guestCart) {
        // Merge guest cart into user cart
        if (userCart) {
          // Add unique products from guest cart to user cart
          const guestItems = guestCart.items.map(item =>
            item.productId.toString(),
          );
          userCart.items = [
            ...userCart.items,
            ...guestCart.items.filter(
              item =>
                !userCart.items.some(
                  i => i.productId.toString() === item.productId.toString(),
                ),
            ),
          ];
        } else {
          // No user cart? Convert guest cart to user cart
          userCart = new Cart({ userId, items: guestCart.items });
        }

        await userCart.save();
        await Cart.deleteOne({ guestId }); // ✅ Delete guest cart after merging

        res.clearCookie('wtc_id', {
          domain: config.cookie_domain,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }
    }

    const pipelines = [
      {
        $match: {
          userId,
        },
      },
      ...commonPipelines,
    ];

    const result = await Cart.aggregatePaginate(pipelines);

    const { docs, totalDocs } = result;

    const data = calcItems(docs[0]);

    return {
      cart: data,
    };
  }

  if (!guestId) {
    guestId = await genCartId();

    const createdCart = await Cart.create({ guestId });

    res.cookie('wtc_id', guestId, {
      domain: config.cookie_domain,
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      cart: createdCart,
    };
  } else {
    const pipelines = [
      {
        $match: {
          guestId,
        },
      },
      ...commonPipelines,
    ];

    const result = await Cart.aggregatePaginate(pipelines);

    const { docs, totalDocs } = result;

    const data = calcItems(docs[0]);

    return {
      cart: data,
    };
  }
};

export const CartService = {
  addToCart,
  wtc,
};
