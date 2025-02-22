import httpStatus from 'http-status';
import { shippingSearchableFields } from '../../constant/shipping.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import ShippingMethod from '../../model/shippingMethod.js';

const editShipping = async payload => {
  const { id, ...data } = payload;

  const existingProduct = await ShippingMethod.findById(id);

  if (!existingProduct)
    throw new ApiError(httpStatus.BAD_REQUEST, 'not found!');

  const result = await ShippingMethod.findOneAndUpdate({ _id: id }, data, {
    new: true,
  });

  return result;
};

const deleteShippings = async ids => {
  const result = await ShippingMethod.deleteMany({
    _id: { $in: ids },
  });

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

const deleteShipping = async payload => {
  const { id } = payload;

  const isExisting = await ShippingMethod.findById(id);

  if (!isExisting) throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');

  const result = await ShippingMethod.findByIdAndDelete(id);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

const getShippingMethodList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: shippingSearchableFields.map(field => ({
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
      countries: val => ({
        countries: { $in: splitter(val) },
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

  const result = await ShippingMethod.aggregatePaginate(pipelines, options);

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

const addShippingMethod = async payload => {
  const result = await ShippingMethod.create(payload);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

export const ShippingService = {
  editShipping,
  deleteShippings,
  deleteShipping,
  getShippingMethodList,
  addShippingMethod,
};
