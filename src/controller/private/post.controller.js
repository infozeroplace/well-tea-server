import httpStatus from 'http-status';
import { paginationFields } from '../../constant/pagination.constant.js';
import { postFilterableField } from '../../constant/post.constant.js';
import { PostService } from '../../service/private/post.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import pick from '../../shared/pick.js';

const getList = catchAsync(async (req, res) => {
  const filters = pick(req.query, postFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await PostService.getList(filters, paginationOptions);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully!',
    meta,
    data,
  });
});

const deletePosts = catchAsync(async (req, res) => {
  const result = await PostService.deletePosts(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleted successfully',
    meta: null,
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const result = await PostService.deletePost(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'delete successfully!',
    meta: null,
    data: result,
  });
});

const editPost = catchAsync(async (req, res) => {
  const result = await PostService.editPost(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'edited successfully!',
    meta: null,
    data: result,
  });
});

const addPost = catchAsync(async (req, res) => {
  const result = await PostService.addPost(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'added successfully!',
    meta: null,
    data: result,
  });
});

export const PostController = {
  getList,
  deletePosts,
  deletePost,
  editPost,
  addPost,
};
