import httpStatus from 'http-status';
import { cartFilterableField } from '../../constant/cart.constant.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { CartService } from '../../service/private/cart.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const getCartList = catchAsync(async (req, res) => {
  const filters = pick(req.query, cartFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await CartService.getCartList(
    filters,
    paginationOptions,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta,
    data,
  });
});

export const CartController = {
  getCartList,
};
