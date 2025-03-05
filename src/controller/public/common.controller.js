import httpStatus from 'http-status';
import { CommonService } from '../../service/public/common.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const getIGAccessToken = catchAsync(async (req, res) => {
  const result = await CommonService.getIGAccessToken(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved ig access token successfully',
    meta: null,
    data: result,
  });
});

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

const wtc = catchAsync(async (req, res) => {
  const result = await CommonService.wtc(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta: null,
    data: result,
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
  getIGAccessToken,
  addToCart,
  wtc,
  addToWishlist,
  wt,
};
