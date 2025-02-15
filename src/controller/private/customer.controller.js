import httpStatus from 'http-status';
import { customerFilterableField } from '../../constant/customer.constants.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { CustomerService } from '../../service/private/customer.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const getCustomerList = catchAsync(async (req, res) => {
  const filters = pick(req.query, customerFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await CustomerService.getCustomerList(
    filters,
    paginationOptions,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer list retrieved successfully',
    meta,
    data,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CustomerService.updateStatus(id);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Status updated successfully',
    meta: null,
    data: result,
  });
});

export const CustomerController = {
  updateStatus,
  getCustomerList,
};
