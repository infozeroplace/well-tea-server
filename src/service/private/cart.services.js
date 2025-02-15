import { cartSearchableFields } from '../../constant/cart.constant.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Cart from '../../model/cart.model.js';

const getCartList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  filtersData['guestId'] = null;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cartSearchableFields.map(field => {
        if (field === 'userId.firstName' || field === 'userId.lastName') {
          return {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ['$userId.firstName', ' ', '$userId.lastName'],
                },
                regex: searchTerm,
                options: 'i',
              },
            },
          };
        }

        return {
          [field]: {
            $regex: searchTerm,
            $options: 'i',
          },
        };
      }),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
      guestId: value => {
        return {
          guestId: { $eq: value },
        };
      },
      default: (field, value) => ({
        [field]: value,
      }),
    };

    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => {
          const handler = filterHandlers[field] || filterHandlers.default;
          return handler(field === 'default' ? [field, value] : value);
        }),
      });
    }
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const sortConditions = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const pipelines = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId',
        pipeline: [
          {
            $unset: 'password', // ✅ Remove password from userId
          },
        ],
      },
    },
    { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },
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
              title: { $first: '$title' },
              sku: { $first: '$sku' },
              thumbnails: { $first: '$thumbnails' },
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
    {
      $match: whereConditions,
    },
  ];

  const options = {
    page: page,
    limit: limit,
    sort: sortConditions,
  };

  const result = await Cart.aggregatePaginate(pipelines, options);

  const { docs, totalDocs } = result;

  return {
    meta: {
      page,
      limit,
      totalDocs,
    },
    data: docs,
  };
};

export const CartService = {
  getCartList,
};
