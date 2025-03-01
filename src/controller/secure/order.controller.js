import httpStatus from 'http-status';
import { orderFilterableField } from '../../constant/order.constant.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { OrderService } from '../../service/secure/order.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const applyCoupon = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { userId } = req.user;

  const result = await OrderService.applyCoupon(data, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'applied successfully!',
    meta: null,
    data: result,
  });
});

const getOrderList = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const filters = pick(req.query, orderFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await OrderService.getOrderList(
    filters,
    paginationOptions,
    userId,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retrieved successfully!',
    meta: null,
    data: result,
  });
});

export const OrderController = {
  applyCoupon,
  getOrderList,
};
