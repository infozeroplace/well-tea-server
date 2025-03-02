import httpStatus from 'http-status';
import { customerSearchableFields } from '../../constant/customer.constants.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import User from '../../model/user.model.js';

const getCustomerFullList = async () => {
  const result = await User.find().select('-password');

  return result;
};

const updateStatus = async id => {
  const existingUser = await User.findOne({ _id: id });

  const result = await User.findOneAndUpdate(
    { _id: id },
    { blockStatus: !existingUser?.blockStatus },
  );

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

const getCustomerList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: customerSearchableFields.map(field => {
        // ✅ Handle firstName + lastName concatenation
        if (field === 'firstName' || field === 'lastName') {
          return {
            $expr: {
              $regexMatch: {
                input: { $concat: ['$firstName', ' ', '$lastName'] }, // ✅ Correct field reference
                regex: searchTerm,
                options: 'i',
              },
            },
          };
        }

        // ✅ Handle other normal fields
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
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => {
        if (field === 'blockStatus') {
          const statuses = value.split(',');
          return {
            [field]: {
              $in: statuses.map(bs => (bs === 'true' ? true : false)),
            },
          };
        } else {
          return {
            [field]: value,
          };
        }
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
      $unset: ['password'],
    },
    {
      $match: whereConditions,
    },
    {
      $sort: sortConditions,
    },
  ];

  const options = {
    page: page,
    limit: limit,
    sort: sortConditions,
  };

  const { docs, totalDocs } = await User.aggregatePaginate(pipelines, options);

  return {
    meta: {
      page,
      limit,
      totalDocs,
    },
    data: docs,
  };
};

export const CustomerService = {
  getCustomerFullList,
  updateStatus,
  getCustomerList,
};
