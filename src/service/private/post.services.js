import httpStatus from 'http-status';
import { postSearchableFields } from '../../constant/post.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Post from '../../model/Post.model.js';
import { mediaUnset } from '../../constant/product.constant.js';

const getList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: postSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
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

  const result = await Post.aggregatePaginate(pipelines, options);

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

const deletePosts = async payload => {
  const { ids } = payload;

  const result = await Post.deleteMany({
    _id: { $in: ids },
  });

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong!');

  return result;
};

const deletePost = async payload => {
  const { id } = payload;

  const isExisting = await Post.findById(id);

  if (!isExisting) throw new ApiError(httpStatus.BAD_REQUEST, 'not found!');

  const result = await Post.findByIdAndDelete(id);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong!');

  return result;
};

const editPost = async payload => {
  const { id } = payload;

  const existedPost = await Post.findById(id);

  if (!existedPost)
    throw new ApiError(httpStatus.BAD_REQUEST, 'post not found!');

  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'try again!');

  return result;
};

const addPost = async payload => {
  const result = await Post.create(payload);

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'try again!');

  return result;
};

export const PostService = {
  getList,
  deletePosts,
  deletePost,
  editPost,
  addPost,
};
