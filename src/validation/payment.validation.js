import { z } from 'zod';

const addressSchema = z.object({
  firstName: z.string({ required_error: 'First name is required' }),
  lastName: z.string({ required_error: 'Last name is required' }),
  address1: z.string({ required_error: 'Address is required' }),
  address2: z.string().optional(),
  city: z.string({ required_error: 'City is required' }),
  country: z.string({ required_error: 'Country is required' }),
  postalCode: z.string({ required_error: 'Postal code is required' }),
  phone: z.string({ required_error: 'Phone is required' }),
});

const createPaymentIntent = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required' })
      .email('invalid email format'),
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
    coupon: z.string().optional(),
    cartId: z.string({ required_error: 'cart id is required' }),
    shippingMethodId: z.string({
      required_error: 'shipping method id is required',
    }),
  }),
});

export const PaymentValidation = {
  createPaymentIntent,
};
