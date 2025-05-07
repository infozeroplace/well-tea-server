import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { cartPipeline } from '../../constant/common.constant.js';
import ApiError from '../../error/ApiError.js';
import Cart from '../../model/cart.model.js';
import Coupon from '../../model/coupon.model.js';
import calcItems from '../../utils/calculateCartItems.js';

const { ObjectId } = mongoose.Types;

const applyCoupon = async payload => {
  const { coupon, cartId } = payload;

  const cartPipelines = [
    {
      $match: {
        _id: new ObjectId(cartId),
      },
    },
    ...cartPipeline,
  ];

  const cartResult = await Cart.aggregatePaginate(cartPipelines);
  const { docs: cartDocs } = cartResult;

  if (0 >= cartDocs?.length)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty!');

  const data = calcItems(cartDocs[0]);

  const existingCoupon = await Coupon.findOne({ coupon });

  if (!existingCoupon)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired!');

  if (new Date() > new Date(existingCoupon.expiresAt))
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired!');

  if (0 >= existingCoupon.limit)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired!');

  if (existingCoupon.discountCap > data.totalPrice)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Spend minimum ${existingCoupon.discountCap}`,
    );

  return existingCoupon;
};

export const CouponService = {
  applyCoupon,
};
