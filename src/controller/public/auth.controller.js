import httpStatus from "http-status";
import config from "../../config/index.js";
import { AuthService } from "../../service/public/auth.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const userRefreshToken = catchAsync(async (req, res) => {
  const { authToken } = req.cookies;

  const result = await AuthService.refreshToken(authToken);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Success!",
    meta: null,
    data: result,
  });
});

const checkAuth = catchAsync(async (req, res) => {
  const { authToken } = req.cookies;

  const result = await AuthService.checkAuth(authToken);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Authenticated!",
    meta: null,
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { ...resetPasswordData } = req.body;

  const result = await AuthService.resetPassword(resetPasswordData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successful!",
    meta: null,
    data: result,
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
  const result = await AuthService.register(registerData);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successful!",
    meta: null,
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { ...loginData } = req.body;

  const result = await AuthService.login(loginData);

  const isInDevelopment = config.env === "development";

  const cookieConfigs = {
    httpOnly: true,
    sameSite: isInDevelopment ? false : "none",
    secure: isInDevelopment ? false : true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // one year
  };

  res.cookie("authToken", result.refreshToken, cookieConfigs);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
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

  const result = await AuthService.googleLogin(code);

  const isInDevelopment = config.env === "development";

  const cookieConfigs = {
    httpOnly: true,
    sameSite: isInDevelopment ? false : "none",
    secure: isInDevelopment ? false : true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // one year
  };

  res.cookie("authToken", result.refreshToken, cookieConfigs);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful!",
    meta: null,
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { token } = req.body;

  const result = await AuthService.refreshToken(token);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Refresh token successfully!",
    meta: null,
    data: result,
  });
});

export const AuthController = {
  userRefreshToken,
  checkAuth,
  resetPassword,
  forgotPassword,
  register,
  login,
  adminLogin,
  googleLogin,
  refreshToken,
};
