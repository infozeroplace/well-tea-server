import { z } from 'zod';

const addToCartSchema = z.object({
  body: z.object({
    cartId: z.string({ required_error: 'cart id is required' }),
    productId: z.string({ required_error: 'product id is required' }),
    actionType: z.string(
      z.enum(['plus', 'minus', 'absolute'], {
        required_error: 'action type is required',
      }),
    ),
    purchaseType: z.string(
      z.enum(['one_time', 'subscription'], {
        required_error: 'purchase type is required',
      }),
    ),
    quantity: z.number({ required_error: 'quantity is required' }),
    unitPriceId: z.string({ required_error: 'unit id is required' }),
    subscriptionId: z.string({ required_error: 'subscription id is required' }),
  }),
});

export const CartValidation = {
  addToCartSchema,
};
