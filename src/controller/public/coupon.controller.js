import httpStatus from 'http-status';
import { CouponService } from '../../service/public/coupon.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const applyCoupon = catchAsync(async (req, res) => {
  const result = await CouponService.applyCoupon(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'applied successfully!',
    meta: null,
    data: result,
  });
});

export const CouponController = {
  applyCoupon,
};
