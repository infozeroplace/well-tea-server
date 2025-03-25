import { z } from 'zod';
import { discountType } from '../constant/coupon.constant.js';

const applyCoupon = z.object({
  body: z.object({
    coupon: z.string({
      required_error: 'coupon is required',
    }),
    paymentIntent: z.string({
      required_error: 'payment intent is required',
    }),
  }),
});

const addCoupon = z.object({
  body: z.object({
    limit: z.number({ required_error: 'limit is required' }),
    coupon: z.string({ required_error: 'coupon is required' }),
    discount: z.number({ required_error: 'discount is required' }),
    discountCap: z.number({ required_error: 'discount cap is required' }),
    discountType: z.enum([...discountType], {
      required_error: 'discount type is required',
    }),
    expiresAt: z.string({ required_error: 'expire date is required' }),
  }),
});

export const CouponValidation = {
  applyCoupon,
  addCoupon,
};
