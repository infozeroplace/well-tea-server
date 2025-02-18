import { z } from 'zod';

const emailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required' })
      .email({ message: 'invalid email address' }),
  }),
});

export const NewsletterValidation = {
  emailZodSchema,
};
