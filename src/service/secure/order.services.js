import { orderSearchableFields } from '../../constant/order.constant.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Order from '../../model/order.model.js';

const getOrderList = async (filters, paginationOptions, userId) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (userId) {
    andCondition.push({ 'user.userId': userId });
  }

  if (searchTerm) {
    andCondition.push({
      $or: orderSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
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
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $unset: ['password'] }],
      },
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'shippingmethods',
        let: { methodId: '$shippingMethod' },
        pipeline: [
          { $unwind: '$methods' },
          {
            $match: {
              $expr: { $eq: ['$methods._id', '$$methodId'] },
            },
          },
          {
            $project: {
              _id: 0,
              title: '$methods.title',
              cost: '$methods.cost',
            },
          },
        ],
        as: 'shippingMethod',
      },
    },
    { $unwind: { path: '$shippingMethod', preserveNullAndEmptyArrays: true } },
    {
      $match: whereConditions,
    },
  ];

  const options = {
    page: page,
    limit: limit,
    sort: sortConditions,
  };

  const result = await Order.aggregatePaginate(pipelines, options);

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

export const OrderService = {
  getOrderList,
};
