import { z } from 'zod';

const email = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({ message: 'invalid email address' }),
  }),
});

export const OtpValidation = {
  email,
};
