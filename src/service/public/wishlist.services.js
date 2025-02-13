import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import User from '../../model/user.model.js';
import Wishlist from '../../model/wishlist.model.js';
import genWishListId from '../../utils/genWishListId.js';

const addToWishlist = async (req, res) => {
  const { wtw_id, auth_refresh } = req.cookies;
  const { productId } = req.body;

  let userId = null;
  let guestId = wtw_id;

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

    // ✅ If the user has a guest wishlist, merge it
    if (guestId) {
      const guestWishlist = await Wishlist.findOne({ guestId });

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

        res.clearCookie('wtw_id', {
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
    guestId = await genWishListId();

    await Wishlist.create({ guestId, items: [{ productId }] });

    res.cookie('wtw_id', guestId, {
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

const wtw = async (req, res) => {
  const { wtw_id, auth_refresh } = req.cookies || {};

  let userId = null;
  let guestId = wtw_id;

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

    // ✅ If the user has a guest wishlist, merge it
    if (guestId) {
      const guestWishlist = await Wishlist.findOne({ guestId });

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

        res.clearCookie('wtw_id', {
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

    const result = await Wishlist.aggregatePaginate(pipelines);

    const { docs, totalDocs } = result;

    return {
      wishlist: docs[0],
    };
  }

  if (!guestId) {
    guestId = await genWishListId();

    const createdWishlist = await Wishlist.create({ guestId });

    res.cookie('wtw_id', guestId, {
      domain: config.cookie_domain,
      path: '/',
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      wishlist: createdWishlist,
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

    const result = await Wishlist.aggregatePaginate(pipelines);

    const { docs, totalDocs } = result;

    return {
      wishlist: docs[0],
    };
  }
};

export const WishlistService = {
  addToWishlist,
  wtw,
};
