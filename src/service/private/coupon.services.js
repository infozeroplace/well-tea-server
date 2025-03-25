import httpStatus from 'http-status';
import { couponSearchableFields } from '../../constant/coupon.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Coupon from '../../model/coupon.model.js';

const deleteCoupons = async ids => {
  const result = await Coupon.deleteMany({
    _id: { $in: ids },
  });

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

const deleteCoupon = async payload => {
  const { id } = payload;

  const isExisting = await Coupon.findById(id);

  if (!isExisting) throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');

  const result = await Coupon.findByIdAndDelete(id);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

const getList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: couponSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const splitter = val => val.split(',').map(x => x.toLowerCase().trim());

    const filterHandlers = {
      discountType: val => ({
        discountType: { $in: splitter(val) },
      }),
      default: (field, val) => ({
        [field]: val,
      }),
    };

    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        const handler = filterHandlers[field] || filterHandlers.default;
        return handler(field === 'default' ? [field, value] : value);
      }),
    });
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
        localField: 'eligibleUsers',
        foreignField: '_id',
        as: 'eligibleUsers',
        pipeline: [{ $unset: 'password' }],
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'usedUsers',
        foreignField: '_id',
        as: 'usedUsers',
        pipeline: [{ $unset: 'password' }],
      },
    },
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

  const result = await Coupon.aggregatePaginate(pipelines, options);

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

const addCoupon = async payload => {
  const { coupon, expiresAt } = payload;

  const isExist = await Coupon.findOne({ coupon });

  if (isExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'coupon already exists!');

  const result = await Coupon.create({
    ...payload,
    expiresAt: new Date(expiresAt),
  });

  return result;
};

export const CouponService = {
  deleteCoupons,
  deleteCoupon,
  getList,
  addCoupon,
};
