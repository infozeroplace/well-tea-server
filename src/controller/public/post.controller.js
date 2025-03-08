import httpStatus from 'http-status';
import { paginationFields } from '../../constant/pagination.constant.js';
import { postFilterableField } from '../../constant/post.constant.js';
import { PostService } from '../../service/public/post.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

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

export const PostController = {
  getList,
};
