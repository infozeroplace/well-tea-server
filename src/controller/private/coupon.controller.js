import httpStatus from 'http-status';
import { BrewInstructionService } from '../../service/private/brewInstruction.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { CouponService } from '../../service/private/coupon.services.js';

const addCoupon = catchAsync(async (req, res) => {
  const result = await CouponService.addCoupon(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'added successfully!',
    meta: null,
    data: result,
  });
});

export const CouponController = {
  addCoupon,
};
