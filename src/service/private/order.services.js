import mongoose from 'mongoose';
import { orderSearchableFields } from '../../constant/order.constant.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Order from '../../model/order.model.js';
import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';

const { ObjectId } = mongoose.Types;

const getOrder = async id => {
  const pipeline = [
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: 'invoices',
        localField: 'invoice',
        foreignField: '_id',
        as: 'invoice',
        pipeline: [{ $unset: ['password'] }],
      },
    },
    { $unwind: { path: '$invoice', preserveNullAndEmptyArrays: true } },
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
      $limit: 1,
    },
  ];

  const result = await Order.aggregate(pipeline);

  if (!result || result.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'order not found!');
  }

  return result[0];
};

const getOrderList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: orderSearchableFields.map(field => {
        if (field === 'user.firstName' || field === 'user.lastName') {
          return {
            $expr: {
              $regexMatch: {
                input: {
                  $concat: ['$user.firstName', ' ', '$user.lastName'],
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
    const splitter = val => val.split(',').map(x => x.toLowerCase().trim());

    const filterHandlers = {
      deliveryStatus: val => ({
        deliveryStatus: { $in: splitter(val) },
      }),
      paymentStatus: val => ({
        paymentStatus: { $in: splitter(val) },
      }),
      customerType: val => ({
        customerType: { $in: splitter(val) },
      }),
      default: (field, val) => ({
        [field]: val,
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
        from: 'invoices',
        localField: 'invoice',
        foreignField: '_id',
        as: 'invoice',
        pipeline: [{ $unset: ['password'] }],
      },
    },
    { $unwind: { path: '$invoice', preserveNullAndEmptyArrays: true } },
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
    {
      $sort: sortConditions,
    },
  ];

  const options = {
    page,
    limit,
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
  getOrder,
  getOrderList,
};
