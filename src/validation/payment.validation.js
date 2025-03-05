import { z } from 'zod';

const confirmPayment = z.object({
  body: z.object({
    paymentIntentId: z.string({
      required_error: 'payment intent id is required',
    }),
  }),
});

export const PaymentValidation = {
  confirmPayment,
};
