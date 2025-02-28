import express from 'express';
import { RewardController } from '../../controller/secure/reward.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { RewardValidation } from '../../validation/reward.validation.js';

const router = express.Router();

router.post(
  '/reward/redeem',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(RewardValidation.redeemRewardSchema),
  RewardController.redeemReward,
);

export const RewardRoutes = router;
