import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import OTP from '../../model/otp.model.js';
import User from '../../model/user.model.js';
import { sendOtpToEmailChangeAdmin } from '../../shared/nodeMailer.js';

const sendToEmailChange = async (email, userId) => {
  const existingUser = await User.findOne({ userId });

  if (!existingUser)
    throw new ApiError(httpStatus.BAD_REQUEST, 'user not found!');

  const existingOtp = OTP.findOne({ email: existingUser.email });

  if (existingOtp) {
    await OTP.deleteOne({ email: existingUser.email });
  }

  const otpCode = Math.floor(1000 + Math.random() * 9000);

  const newOtp = await OTP.create({
    email: existingUser.email,
    userId: existingUser.userId,
    code: otpCode,
  });

  await sendOtpToEmailChangeAdmin(email, newOtp.code);

  return;
};

export const OtpService = {
  sendToEmailChange,
};
