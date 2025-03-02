import { z } from 'zod';

const addCoupon = z.object({
  body: z.object({
    coupon: z.string({ required_error: 'coupon is required' }),
    eligibleUsers: z.array(z.string()),
    discount: z.number({ required_error: 'discount is required' }),
    isAll: z.boolean({ required_error: 'isAll is required' }),
    expiresAt: z.string({ required_error: 'expire date is required' }),
  }),
});

export const CouponValidation = {
  addCoupon,
};
