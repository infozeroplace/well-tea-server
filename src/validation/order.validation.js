import { z } from 'zod';

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

export const OrderValidation = {
  applyCoupon,
};
