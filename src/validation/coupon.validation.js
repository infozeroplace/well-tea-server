import { z } from 'zod';

const addCoupon = z.object({
  body: z.object({
    coupon: z.string({ required_error: 'coupon is required' }),
    eligibleUsers: z
      .array(z.string())
      .min(1, { message: 'at least one user is required' }),
    discount: z.number({ required_error: 'discount is required' }),
    expiresAt: z.string({ required_error: 'expire date is required' }),
  }),
});

export const CouponValidation = {
  addCoupon,
};
