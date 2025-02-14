import { cartSearchableFields } from '../../constant/cart.constant.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Cart from '../../model/cart.model.js';

const getCartList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: cartSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
      userId: (value) => {
        console.log(value)
        const filetypes = value.split(",");
        return {
            userId: {
            $in: filetypes,
          },
        };
      },
      guestId: (value) => {
        const medias = value.split(",");
        return {
            guestId: {
            $in: medias,
          },
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
          return handler(field === "default" ? [field, value] : value);
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
