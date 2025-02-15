import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import OTP from '../../model/otp.model.js';
import User from '../../model/user.model.js';

const editPassword = async (payload, userId) => {
  const { currentPassword, newPassword } = payload;

  const user = await User.findOne({ userId });

  if (!user.password || !(await user.matchPassword(currentPassword))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'password does not match!');
  }

  const result = await User.findOneAndUpdate(
    { userId },
    {
      password: await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds),
      ),
    },
    { new: true },
  );

  result.password = undefined;

  return result;
};

const editEmail = async payload => {
  const { email, otp, existingEmail } = payload;

  const existingOtp = await OTP.findOne({ email: existingEmail });

  if (existingOtp && existingOtp.code === otp) {
    const result = await User.findOneAndUpdate(
      { email: existingEmail },
      { $set: { email } },
      { new: true, upsert: true },
    );

    result.password = undefined;

    await OTP.deleteOne({ email: existingEmail });

    const accessToken = jwtHelpers.createToken(
      {
        role: result?.role,
        userId: result?.userId,
        email: result?.email,
        blockStatus: result?.blockStatus,
      },
      config?.jwt?.secret,
      config?.jwt?.expires_in,
    );

    // Create refresh token
    const refreshToken = jwtHelpers.createToken(
      {
        role: result?.role,
        userId: result?.userId,
        email: result?.email,
        blockStatus: result?.blockStatus,
      },
      config?.jwt?.refresh_secret,
      config?.jwt?.refresh_expires_in,
    );

    return {
      accessToken,
      refreshToken,
      user: result,
    };
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'invalid otp!');
  }
};

export const ProfileService = {
  editPassword,
  editEmail,
};
