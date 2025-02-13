import httpStatus from 'http-status';
import { CartService } from '../../service/public/cart.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const addToCart = catchAsync(async (req, res) => {
  const { message } = await CartService.addToCart(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message,
    meta: null,
    data: null,
  });
});

const wtc = catchAsync(async (req, res) => {
  const result = await CartService.wtc(req, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta: null,
    data: result,
  });
});

export const CartController = {
  addToCart,
  wtc,
};
