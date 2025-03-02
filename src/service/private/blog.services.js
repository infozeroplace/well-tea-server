import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import Blog from '../../model/blog.model.js';

// const editBlog = async payload => {
//   const { id, ...data } = payload;

//   const exist = await Blog.findById(id);

//   if (!exist) throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');

//   const result = await Blog.findOneAndUpdate(
//     { _id: id },
//     { $set: { ...data } },
//     { new: true, upsert: true },
//   );

//   if (data.thumbnail !== exist.thumbnail) await removeImage(exist.thumbnail);

//   return result;
// };

// const blog = async id => {
//   const result = await Blog.findOne({ _id: id });

//   if (!result) throw new ApiError(httpStatus.BAD_REQUEST, 'Blog not found!');

//   return result;
// };

// const deleteBlogs = async ids => {
//   const exists = await Blog.find({ _id: { $in: ids } });

//   if (!exists.length) throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');

//   const result = await Blog.deleteMany({
//     _id: { $in: ids },
//   });

//   if (!result)
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

//   for (const elem of exists) {
//     await removeImage(elem.thumbnail);
//   }

//   return result;
// };

// const deleteBlog = async id => {
//   const exist = await Blog.findById(id);

//   if (!exist) throw new ApiError(httpStatus.BAD_REQUEST, 'Not found!');

//   const result = await Blog.deleteOne({ _id: id });

//   if (!result)
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

//   await removeImage(exist.thumbnail);

//   return result;
// };

// const blogList = async (filters, paginationOptions) => {
//   const { searchTerm, ...filtersData } = filters;

//   const andCondition = [];

//   if (searchTerm) {
//     andCondition.push({
//       $or: blogSearchableFields.map(field => ({
//         [field]: {
//           $regex: searchTerm,
//           $options: 'i',
//         },
//       })),
//     });
//   }

//   if (Object.keys(filtersData).length) {
//     andCondition.push({
//       $and: Object.entries(filtersData).map(([field, value]) => ({
//         [field]: value,
//       })),
//     });
//   }

//   const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

//   const { page, limit, sortBy, sortOrder } =
//     PaginationHelpers.calculationPagination(paginationOptions);

//   const sortConditions = {};

//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder;
//   }

//   const pipelines = [
//     {
//       $match: whereConditions,
//     },
//   ];

//   const options = {
//     page: page,
//     limit: limit,
//     sort: sortConditions,
//   };

//   const { docs, totalDocs } = await Blog.aggregatePaginate(pipelines, options);

//   return {
//     meta: {
//       page,
//       limit,
//       totalDocs,
//     },
//     data: docs,
//   };
// };

const addBlog = async payload => {
  const { ...data } = payload;

  const result = await Blog.create(data);

  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

  return result;
};

export const BlogService = {
  // editBlog,
  // blog,
  // deleteBlogs,
  // deleteBlog,
  // blogList,
  addBlog,
};
