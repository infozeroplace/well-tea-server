import httpStatus from 'http-status';
import { ShippingService } from '../../service/public/shipping.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const getShippingMethodList = catchAsync(async (req, res) => {
  const result = await ShippingService.getShippingMethodList(req.query);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta: null,
    data: result,
  });
});

export const ShippingController = {
  getShippingMethodList,
};
