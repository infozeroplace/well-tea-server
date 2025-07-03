import httpStatus from 'http-status';
import { blogSearchableFields } from '../../constant/blog.constant.js';
import { mediaUnset } from '../../constant/product.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';
import Blog from '../../model/blog.model.js';

const getAllBlogs = async () => {
  const blogs = await Blog.find({})
    .populate({
      path: 'thumbnail',
      select: 'filepath alternateText',
    })
    .select('urlParameter thumbnail metaTitle updatedAt');

  return blogs;
};

const blog = async id => {
  const result = await Blog.findOne({ urlParameter: id }).populate('thumbnail');

  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'Blog not found!');

  return result;
};

const blogList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: blogSearchableFields.map(field => ({
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
  ];

  const options = {
    page: page,
    limit: limit,
    sort: sortConditions,
  };

  const { docs, totalDocs } = await Blog.aggregatePaginate(pipelines, options);

  return {
    meta: {
      page,
      limit,
      totalDocs,
    },
    data: docs,
  };
};

export const BlogService = {
  getAllBlogs,
  blog,
  blogList,
};
