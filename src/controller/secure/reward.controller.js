import httpStatus from 'http-status';
import { RewardService } from '../../service/secure/reward.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const redeemReward = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { userId } = req.user;

  const result = await RewardService.redeemReward(data, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful!',
    meta: null,
    data: result,
  });
});

export const RewardController = {
  redeemReward,
};
