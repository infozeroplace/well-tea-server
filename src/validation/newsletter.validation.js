import { z } from 'zod';

const sendBulkEmailZodSchema = z.object({
  body: z.object({
    emails: z
      .array(
        z
          .string({ required_error: 'email is required' })
          .email({ message: 'invalid email address' }),
        {
          required_error: 'email is required',
        },
      )
      .min(1, { message: 'email is required' }),
  }),
});

const emailZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'email is required' })
      .email({ message: 'invalid email address' }),
  }),
});

export const NewsletterValidation = {
  sendBulkEmailZodSchema,
  emailZodSchema,
};
