import axios from 'axios';
import httpStatus from 'http-status';
import { stripe } from '../../app.js';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import updateCart from '../../helper/updateCart.js';
import Cart from '../../model/cart.model.js';
import Coupon from '../../model/coupon.model.js';
import ShippingMethod from '../../model/shippingMethod.js';
import TempOrder from '../../model/tempOrder.model.js';
import User from '../../model/user.model.js';
import Wishlist from '../../model/wishlist.model.js';
import genGuestId from '../../utils/genGuestId.js';

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

const updateTempOrder = async (paymentIntentId, shippingMethodId, coupon) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  const orderId = paymentIntent.metadata.orderId;

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
    coupon: existingCoupon?.coupon || '',
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

  await stripe.paymentIntents.update(paymentIntentId, {
    amount: Number(Math.round(total * 100).toFixed(2)),
  });
};

const getIGAccessToken = async query => {
  const { code } = query;

  if (!code) {
    throw new ApiError(httpStatus.FORBIDDEN, 'authorization code not found');
  }

  const accessTokenUrl = 'https://graph.facebook.com/v18.0/oauth/access_token';

  const params = new URLSearchParams({
    client_id: config.instagram_client_id,
    client_secret: config.instagram_client_secret,
    redirect_uri: config.server_url + config.instagram_redirect_uri,
    code: code,
  });

  const { data } = await axios.get(`${accessTokenUrl}?${params}`);

  return data.access_token;
};

const addToCart = async (req, res) => {
  const { wtg_id, auth_refresh } = req.cookies;
  const {
    paymentIntentId = '',
    shippingMethodId = '',
    coupon = '',
    productId,
    actionType,
    purchaseType,
    quantity,
    unitPriceId,
    subscriptionId,
  } = req.body;

  let userId = null;
  let guestId = wtg_id;

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

    // ✅ User is logged in – find their wishlist
    let userWishlist = await Wishlist.findOne({ userId });

    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      const guestWishlist = await Wishlist.findOne({ guestId });

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
      }

      if (guestWishlist) {
        // Merge guest wishlist into user wishlist
        if (userWishlist) {
          // Add unique products from guest wishlist to user wishlist
          const guestItems = guestWishlist.items.map(item =>
            item.productId.toString(),
          );
          userWishlist.items = [
            ...userWishlist.items,
            ...guestWishlist.items.filter(
              item =>
                !userWishlist.items.some(
                  i => i.productId.toString() === item.productId.toString(),
                ),
            ),
          ];
        } else {
          // No user wishlist? Convert guest wishlist to user wishlist
          userWishlist = new Wishlist({ userId, items: guestWishlist.items });
        }

        await userWishlist.save();
        await Wishlist.deleteOne({ guestId }); // ✅ Delete guest wishlist after merging
      }

      if (guestCart || guestWishlist) {
        res.clearCookie('wtg_id', {
          domain: config.cookie_domain,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }
    }

    const updatedCartData = await updateCart(
      userCart,
      productId,
      actionType,
      purchaseType,
      quantity,
      unitPriceId,
      subscriptionId,
    );

    if (paymentIntentId && shippingMethodId) {
      await updateTempOrder(paymentIntentId, shippingMethodId);
    }

    return updatedCartData;
  }

  // ✅ Guest Cart Logic
  if (!guestId) {
    guestId = await genGuestId();

    await Cart.create({
      guestId,
      items: [
        { productId, purchaseType, quantity, unitPriceId, subscriptionId },
      ],
    });

    await Wishlist.create({ guestId, userId: null });

    res.cookie('wtg_id', guestId, {
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

  const updatedCartData = await updateCart(
    guestCart,
    productId,
    actionType,
    purchaseType,
    quantity,
    unitPriceId,
    subscriptionId,
  );

  if (paymentIntentId && shippingMethodId) {
    await updateTempOrder(paymentIntentId, shippingMethodId);
  }

  return updatedCartData;
};

const addToWishlist = async (req, res) => {
  const { wtg_id, auth_refresh } = req.cookies;
  const { productId } = req.body;

  let userId = null;
  let guestId = wtg_id;

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

    // ✅ User is logged in – find their wishlist
    let userWishlist = await Wishlist.findOne({ userId });

    // ✅ If the user has a guest cart, merge it
    // ✅ If the user has a guest wishlist, merge it
    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      const guestWishlist = await Wishlist.findOne({ guestId });

      if (guestCart) {
        // Merge guest cart into user cart
        if (!userCart) {
          // No user cart? Convert guest cart to user cart
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
        await Cart.deleteOne({ guestId }); // ✅ Delete guest cart after merging
      }

      if (guestWishlist) {
        // Merge guest wishlist into user wishlist
        if (userWishlist) {
          // Add unique products from guest wishlist to user wishlist
          const guestItems = guestWishlist.items.map(item =>
            item.productId.toString(),
          );
          userWishlist.items = [
            ...userWishlist.items,
            ...guestWishlist.items.filter(
              item =>
                !userWishlist.items.some(
                  i => i.productId.toString() === item.productId.toString(),
                ),
            ),
          ];
        } else {
          // No user wishlist? Convert guest wishlist to user wishlist
          userWishlist = new Wishlist({ userId, items: guestWishlist.items });
        }

        await userWishlist.save();
        await Wishlist.deleteOne({ guestId }); // ✅ Delete guest wishlist after merging
      }

      if (guestCart || guestWishlist) {
        res.clearCookie('wtg_id', {
          domain: config.cookie_domain,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }
    }

    // ✅ Check if the product is already in the user wishlist (toggle logic)
    const itemIndex = userWishlist.items.findIndex(
      item => item.productId.toString() === productId,
    );

    if (itemIndex > -1) {
      userWishlist.items.splice(itemIndex, 1); // Remove item if it exists
      await userWishlist.save();

      return {
        message: 'Item removed from wishlist',
      };
    } else {
      userWishlist.items.push({ productId }); // Add item if it does not exist
      await userWishlist.save();

      return {
        message: 'Item added to wishlist',
      };
    }
  }

  // ✅ Guest User Logic
  if (!guestId) {
    guestId = await genGuestId();

    await Cart.create({ guestId, userId: null });
    await Wishlist.create({ guestId, userId: null, items: [{ productId }] });

    res.cookie('wtg_id', guestId, {
      domain: config.cookie_domain,
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      message: 'Item added to wishlist',
    };
  }

  // ✅ Guest wishlist update (toggle item)
  const guestWishlist = await Wishlist.findOne({ guestId });

  if (!guestWishlist)
    throw new ApiError(httpStatus.FORBIDDEN, 'Wishlist not found');

  const itemIndex = guestWishlist.items.findIndex(
    item => item.productId.toString() === productId,
  );

  if (itemIndex > -1) {
    guestWishlist.items.splice(itemIndex, 1);
    await guestWishlist.save();

    return {
      message: 'Item removed from wishlist',
    };
  } else {
    guestWishlist.items.push({ productId });
    await guestWishlist.save();

    return {
      message: 'Item added to wishlist',
    };
  }
};

const wt = async (req, res) => {
  const { wtg_id, auth_refresh } = req.cookies || {};

  let userId = null;
  let guestId = wtg_id;

  const commonPipelinesCart = [
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

  const commonPipelinesWishlist = [
    {
      $lookup: {
        from: 'products',
        let: { productIds: '$items.productId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ['$_id', '$$productIds'] },
                  { $eq: ['$isPublished', true] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'media',
              localField: 'thumbnails',
              foreignField: '_id',
              as: 'thumbnails',
            },
          },
          {
            $lookup: {
              from: 'assortments',
              localField: 'attribute',
              foreignField: '_id',
              as: 'attribute',
              pipeline: [
                {
                  $lookup: {
                    from: 'media',
                    localField: 'thumbnail',
                    foreignField: '_id',
                    as: 'thumbnail',
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'assortments',
              localField: 'category',
              foreignField: '_id',
              as: 'category',
              pipeline: [
                {
                  $lookup: {
                    from: 'media',
                    localField: 'thumbnail',
                    foreignField: '_id',
                    as: 'thumbnail',
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'assortments',
              localField: 'productType',
              foreignField: '_id',
              as: 'productType',
              pipeline: [
                {
                  $lookup: {
                    from: 'media',
                    localField: 'thumbnail',
                    foreignField: '_id',
                    as: 'thumbnail',
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: 'assortments',
              localField: 'teaFormat',
              foreignField: '_id',
              as: 'teaFormat',
              pipeline: [
                {
                  $lookup: {
                    from: 'media',
                    localField: 'thumbnail',
                    foreignField: '_id',
                    as: 'thumbnail',
                  },
                },
              ],
            },
          },
          {
            $group: {
              _id: '$_id',
              urlParameter: { $first: '$urlParameter' },
              sku: { $first: '$sku' },
              title: { $first: '$title' },
              thumbnails: { $first: '$thumbnails' },
              category: { $first: '$category' },
              attribute: { $first: '$attribute' },
              productType: { $first: '$productType' },
              teaFormat: { $first: '$teaFormat' },
              isSale: { $first: '$isSale' },
              isSubscription: { $first: '$isSubscription' },
              isMultiDiscount: { $first: '$isMultiDiscount' },
              sale: { $first: '$sale' },
              subscriptionSale: { $first: '$subscriptionSale' },
              multiDiscountQuantity: { $first: '$multiDiscountQuantity' },
              multiDiscountAmount: { $first: '$multiDiscountAmount' },
              ratings: { $first: '$ratings' },
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
        as: 'items',
      },
    },
  ];

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
    // ✅ User is logged in – find their wishlist
    let userWishlist = await Wishlist.findOne({ userId });

    // ✅ If the user has a guest cart, merge it
    // ✅ If the user has a guest wishlist, merge it
    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      const guestWishlist = await Wishlist.findOne({ guestId });

      if (guestCart) {
        // Find the user's cart
        let userCart = await Cart.findOne({ userId });

        if (!userCart) {
          // No user cart? Convert guest cart to user cart by updating guestCart with userId
          guestCart.userId = userId;
          await guestCart.save();
        } else {
          // Merge guest cart items into user cart
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
              userCart.items.push(guestItem); // Add guest cart items to user cart
            }
          });

          // Save updated user cart
          await userCart.save();

          // ✅ Instead of deleting guest cart, update it to belong to the user
          guestCart.userId = userId;
          guestCart.items = userCart.items; // Sync guest cart with user cart items
          await guestCart.save();
        }
      }

      if (guestWishlist) {
        // Merge guest wishlist into user wishlist
        if (userWishlist) {
          // Add unique products from guest wishlist to user wishlist
          const guestItems = guestWishlist.items.map(item =>
            item.productId.toString(),
          );
          userWishlist.items = [
            ...userWishlist.items,
            ...guestWishlist.items.filter(
              item =>
                !userWishlist.items.some(
                  i => i.productId.toString() === item.productId.toString(),
                ),
            ),
          ];
        } else {
          // No user wishlist? Convert guest wishlist to user wishlist
          userWishlist = new Wishlist({ userId, items: guestWishlist.items });
        }

        await userWishlist.save();
        await Wishlist.deleteOne({ guestId }); // ✅ Delete guest wishlist after merging
      }

      if (guestCart || guestWishlist) {
        res.clearCookie('wtg_id', {
          domain: config.cookie_domain,
          path: '/',
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      }
    }

    const cartPipelines = [
      {
        $match: {
          userId,
        },
      },
      ...commonPipelinesCart,
    ];

    const wishlistPipelines = [
      {
        $match: {
          userId,
        },
      },
      ...commonPipelinesWishlist,
    ];

    const cartResult = await Cart.aggregatePaginate(cartPipelines);
    const wishlistResult = await Wishlist.aggregatePaginate(wishlistPipelines);

    const { docs: cartDocs } = cartResult;
    const { docs: wishlistDocs } = wishlistResult;

    const data = calcItems(cartDocs[0]);

    return {
      cart: data,
      wishlist: wishlistDocs[0],
    };
  }

  if (!guestId) {
    guestId = await genGuestId();

    const createdCart = await Cart.create({ guestId, userId: null });
    const createdWishlist = await Wishlist.create({ guestId, userId: null });

    res.cookie('wtg_id', guestId, {
      domain: config.cookie_domain,
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      cart: createdCart,
      wishlist: createdWishlist,
    };
  } else {
    const cartPipelines = [
      {
        $match: {
          guestId,
        },
      },
      ...commonPipelinesCart,
    ];

    const wishlistPipelines = [
      {
        $match: {
          guestId,
        },
      },
      ...commonPipelinesWishlist,
    ];

    const cartResult = await Cart.aggregatePaginate(cartPipelines);
    const wishlistResult = await Wishlist.aggregatePaginate(wishlistPipelines);

    const { docs: cartDocs } = cartResult;
    const { docs: wishlistDocs } = wishlistResult;

    const data = calcItems(cartDocs[0]);

    return {
      cart: data,
      wishlist: wishlistDocs[0],
    };
  }
};

export const CommonService = { getIGAccessToken, addToCart, addToWishlist, wt };
