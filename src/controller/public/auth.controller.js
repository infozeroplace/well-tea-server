import httpStatus from "http-status";
import config from "../../config/index.js";
import { AuthService } from "../../service/public/auth.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const resetPassword = catchAsync(async (req, res) => {
  const { ...resetPasswordData } = req.body;

  const { refreshToken, ...data } = await AuthService.resetPassword(
    resetPasswordData
  );

  const isProduction = config.env === "production";

  res.cookie("auth_refresh", refreshToken, {
    domain: ".zeroplace.co",
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful!",
    meta: null,
    data,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { ...forgotPasswordData } = req.body;

  await AuthService.forgotPassword(forgotPasswordData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "An email has been sent!",
    meta: null,
    data: null,
  });
});

const register = catchAsync(async (req, res) => {
  const { ...registerData } = req.body;

  const { refreshToken, ...data } = await AuthService.register(registerData);

  const isProduction = config.env === "production";

  res.cookie("auth_refresh", refreshToken, {
    domain: ".zeroplace.co",
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successful!",
    meta: null,
    data,
  });
});

const login = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const { refreshToken, ...data } = await AuthService.login(loginData);

  const isProduction = config.env === "production";

  res.cookie("auth_refresh", refreshToken, {
    domain: ".zeroplace.co",
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data,
  });
});

const adminLogin = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const result = await AuthService.adminLogin(loginData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data: result,
  });
});

const googleLogin = catchAsync(async (req, res) => {
  const { code } = req.body;

  const { refreshToken, ...data } = await AuthService.googleLogin(code);

  const isProduction = config.env === "production";

  res.cookie("auth_refresh", refreshToken, {
    domain: ".zeroplace.co",
    path: "/",
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { auth_refresh } = req.cookies;

  const result = await AuthService.refreshToken(auth_refresh, res);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successfully!",
    meta: null,
    data: result,
  });
});

export const AuthController = {
  resetPassword,
  forgotPassword,
  register,
  login,
  adminLogin,
  googleLogin,
  refreshToken,
};
