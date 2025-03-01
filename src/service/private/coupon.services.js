import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import Coupon from '../../model/coupon.model.js';

const addCoupon = async payload => {
  const { coupon, eligibleUsers, discount, expiresAt } = payload;
  const isExist = await Coupon.findOne({ coupon });

  if (isExist)
    throw new ApiError(httpStatus.BAD_REQUEST, 'coupon already exists!');

  const result = await Coupon.create({
    coupon,
    eligibleUsers,
    discount,
    expiresAt: new Date(expiresAt),
  });

  return result;
};

export const CouponService = {
  addCoupon,
};
