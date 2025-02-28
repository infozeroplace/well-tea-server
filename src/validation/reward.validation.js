import { z } from 'zod';

const redeemRewardSchema = z.object({
  body: z.object({
    points: z.number({ required_error: 'SKU is required' }),
  }),
});

export const RewardValidation = {
  redeemRewardSchema,
};
