import httpStatus from 'http-status';
import { paginationFields } from '../../constant/pagination.constant.js';
import { shippingFilterableField } from '../../constant/shipping.constant.js';
import { ShippingService } from '../../service/private/shipping.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const editShipping = catchAsync(async (req, res) => {
  const result = await ShippingService.editShipping(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'edited successfully!',
    meta: null,
    data: result,
  });
});

const deleteShippings = catchAsync(async (req, res) => {
  const result = await ShippingService.deleteShippings(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleted successfully',
    meta: null,
    data: result,
  });
});

const deleteShipping = catchAsync(async (req, res) => {
  const result = await ShippingService.deleteShipping(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'delete successfully!',
    meta: null,
    data: result,
  });
});

const getShippingMethodList = catchAsync(async (req, res) => {
  const filters = pick(req.query, shippingFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await ShippingService.getShippingMethodList(
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

const addShippingMethod = catchAsync(async (req, res) => {
  const result = await ShippingService.addShippingMethod(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'added successfully!',
    meta: null,
    data: result,
  });
});

export const ShippingController = {
  editShipping,
  deleteShippings,
  deleteShipping,
  getShippingMethodList,
  addShippingMethod,
};
