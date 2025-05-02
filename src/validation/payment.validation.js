import { z } from 'zod';

const addressSchema = z.union([
  z
    .object({
      userId: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      company: z.string().optional(),
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional(),
      phone: z.string().optional(),
    })
    .nullable(),
  z.literal(null),
]);

const updatePaymentIntent = z.object({
  body: z.object({
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    cartId: z.string({ required_error: 'cart id is required' }),
    id: z.string({ required_error: 'intent id is required' }),
    coupon: z.string().optional(),
    email: z
      .union([
        z.string().email('invalid email format').nullable(),
        z.literal(null),
      ])
      .optional(),
    shippingMethodId: z.string({
      required_error: 'shipping method id is required',
    }),
  }),
});

const createPaymentIntent = z.object({
  body: z.object({
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    cartId: z.string({ required_error: 'cart id is required' }),
    email: z
      .union([
        z.string().email('invalid email format').nullable(),
        z.literal(null),
      ])
      .optional(),
    shippingMethodId: z.string({
      required_error: 'shipping method id is required',
    }),
  }),
});

export const PaymentValidation = {
  updatePaymentIntent,
  createPaymentIntent,
};
