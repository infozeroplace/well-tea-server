import httpStatus from 'http-status';
import { stripe } from '../../app.js';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import Coupon from '../../model/coupon.model.js';
import TempOrder from '../../model/tempOrder.model.js';

const endpointSecret = config.stripe_endpoint_secret_key;

const applyCoupon = async payload => {
  const { coupon, paymentIntent } = payload;

  const existingCoupon = await Coupon.findOne({ coupon });

  if (!existingCoupon)
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid or expired!');

  if (new Date() > new Date(existingCoupon.expiresAt))
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid or expired!');

  if (existingCoupon.limit <= 0)
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid or expired!');

  const paymentIntentData = await stripe.paymentIntents.retrieve(paymentIntent);

  const tempOrder = await TempOrder.findOne({
    orderId: paymentIntentData?.metadata?.orderId,
  });

  if (existingCoupon.discountCap > tempOrder.subtotal)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `spend minimum ${existingCoupon.discountCap}`,
    );

  if (tempOrder.coupon)
    throw new ApiError(httpStatus.BAD_REQUEST, 'already used!');

  return existingCoupon;
};

export const CouponService = {
  applyCoupon,
};
