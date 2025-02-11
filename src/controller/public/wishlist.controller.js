import httpStatus from 'http-status';
import { WishlistService } from '../../service/public/wishlist.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const addToWishlist = catchAsync(async (req, res) => {
  const { message } = await WishlistService.addToWishlist(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    meta: null,
    data: null,
  });
});

const wtw = catchAsync(async (req, res) => {
  const result = await WishlistService.wtw(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta: null,
    data: result,
  });
});

export const WishlistController = {
  addToWishlist,
  wtw,
};
