import { z } from 'zod';

const redeemRewardSchema = z.object({
  body: z.object({
    points: z.number({ required_error: 'points are required' }),
  }),
});

export const RewardValidation = {
  redeemRewardSchema,
};
