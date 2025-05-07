import httpStatus from 'http-status';
import { CommonService } from '../../service/public/common.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const addToCart = catchAsync(async (req, res) => {
  const { message } = await CommonService.addToCart(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    meta: null,
    data: null,
  });
});

const addToWishlist = catchAsync(async (req, res) => {
  const { message } = await CommonService.addToWishlist(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    meta: null,
    data: null,
  });
});

const wt = catchAsync(async (req, res) => {
  const result = await CommonService.wt(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta: null,
    data: result,
  });
});

export const CommonController = {
  addToCart,
  addToWishlist,
  wt,
};
