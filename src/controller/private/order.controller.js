import httpStatus from 'http-status';
import { orderFilterableField } from '../../constant/order.constant.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { OrderService } from '../../service/private/order.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const getOrder = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OrderService.getOrder(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta: null,
    data: result,
  });
});

const getOrderList = catchAsync(async (req, res) => {
  const filters = pick(req.query, orderFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await OrderService.getOrderList(
    filters,
    paginationOptions,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta,
    data,
  });
});

export const OrderController = {
  getOrder,
  getOrderList,
};
