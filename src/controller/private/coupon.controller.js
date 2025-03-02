import httpStatus from 'http-status';
import { couponFilterableField } from '../../constant/coupon.constant.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { CouponService } from '../../service/private/coupon.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const deleteCoupons = catchAsync(async (req, res) => {
  const result = await CouponService.deleteCoupons(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleted successfully',
    meta: null,
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const result = await CouponService.deleteCoupon(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'deleted successfully!',
    meta: null,
    data: result,
  });
});

const getList = catchAsync(async (req, res) => {
  const filters = pick(req.query, couponFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await CouponService.getList(
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
  deleteCoupons,
  deleteCoupon,
  getList,
  addCoupon,
};
