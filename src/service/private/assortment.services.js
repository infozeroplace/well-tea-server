import httpStatus from 'http-status';
import { assortmentSearchableFields } from '../../constant/assortment.constant.js';
import { mediaUnset } from '../../constant/product.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Assortment from '../../model/assortment.model.js';

const editAssortment = async payload => {
  const isExists = await Assortment.findById(payload.id);

  if (!isExists) throw new ApiError(httpStatus.BAD_REQUEST, 'not found!');

  const result = await Assortment.findByIdAndUpdate(payload.id, payload);

  return result;
};

const getAllAssortmentList = async () => {
  const result = await Assortment.find({});
  return result;
};

const getAssortmentList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: assortmentSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
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
        from: 'media',
        localField: 'thumbnail',
        foreignField: '_id',
        as: 'thumbnail',
        pipeline: [mediaUnset],
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

  const result = await Assortment.aggregatePaginate(pipelines, options);

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

const addAssortment = async payload => {
  const result = await Assortment.create(payload);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

export const AssortmentService = {
  editAssortment,
  getAllAssortmentList,
  getAssortmentList,
  addAssortment,
};
