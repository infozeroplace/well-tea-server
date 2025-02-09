import { z } from "zod";

const editPasswordForSocialUserZodSchema = z.object({
  body: z.object({
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .regex(/^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).{6,}$/, {
        message:
          "Password must contain one special character and minimum six characters.",
      }),
  }),
});

const editPasswordZodSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: "Current password is required",
    }),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .regex(/^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).{6,}$/, {
        message:
          "Password must contain one special character and minimum six characters.",
      }),
  }),
});

export const ProfileValidation = {
  editPasswordForSocialUserZodSchema,
  editPasswordZodSchema,
};
