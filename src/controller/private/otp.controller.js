import httpStatus from 'http-status';
import { OtpService } from '../../service/private/otp.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const sendToEmailChange = catchAsync(async (req, res) => {
  const { email } = req.body;
  const { userId } = req.user;

  await OtpService.sendToEmailChange(email, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP has been sent to your email',
    meta: null,
    data: null,
  });
});

export const OtpController = {
  sendToEmailChange,
};
