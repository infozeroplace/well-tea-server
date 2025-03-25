import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import Coupon from '../../model/coupon.model.js';
import User from '../../model/user.model.js';
import generateCoupon from '../../utils/generateCoupon.js';

const redeemReward = async (payload, userId) => {
  const { points } = payload;

  let discount = 0;
  let subtract = 0;

  if (points >= 100 && points < 200) {
    discount = 5;
    subtract = 100;
  } else if (points >= 200 && points < 300) {
    discount = 10;
    subtract = 200;
  } else if (points >= 300 && points < 400) {
    discount = 15;
    subtract = 300;
  } else if (points >= 400 && points < 500) {
    discount = 20;
    subtract = 400;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid points for redemption');
  }

  const user = await User.findOne({ userId });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found');
  }

  if (user.rewardPoints < subtract) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Insufficient reward points');
  }

  await User.findOneAndUpdate(
    { userId },
    { $inc: { rewardPoints: -subtract } },
  );

  const coupon = await generateCoupon();

  await Coupon.create({
    limit: 1,
    coupon,
    discount,
    discountCap: 5,
    discountType: 'solid',
  });

  return {
    coupon,
  };
};

export const RewardService = {
  redeemReward,
};
