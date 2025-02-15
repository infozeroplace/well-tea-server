import httpStatus from 'http-status';
import config from '../../config/index.js';
import { ProfileService } from '../../service/private/profile.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const editPassword = catchAsync(async (req, res) => {
  const userId = req.user.userId;
  const result = await ProfileService.editPassword(req.body, userId);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password updated successfully',
    meta: null,
    data: result,
  });
});

const editEmail = catchAsync(async (req, res) => {
  const payload = {
    ...req.body,
    existingEmail: req.user.email,
  };

  const { refreshToken, ...data } = await ProfileService.editEmail(payload);

  res.cookie('auth', refreshToken, {
    domain: config.cookie_domain,
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'email edited successfully',
    meta: null,
    data,
  });
});

export const ProfileController = {
  editPassword,
  editEmail,
};
