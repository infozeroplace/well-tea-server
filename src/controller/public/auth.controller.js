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

  const isInDevelopment = config.env === "development";

  const cookieConfigs = {
    httpOnly: true,
    sameSite: isInDevelopment ? false : "none",
    secure: isInDevelopment ? false : true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  };

  res.cookie("auth_refresh", refreshToken, cookieConfigs);

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

  const { refreshToken, ...data } = await AuthService.login(loginData);

  const isInDevelopment = config.env === "development";

  const cookieConfigs = {
    httpOnly: true,
    sameSite: isInDevelopment ? false : "none",
    secure: isInDevelopment ? false : true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
  };

  res.cookie("auth_refresh", refreshToken, cookieConfigs);

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

  const isProduction = config.env === "production"; // ✅ Check if in production

  res.cookie("auth_refresh", refreshToken, {
    domain: ".zeroplace.co", // ✅ Allows access from welltea.zeroplace.co and other subdomains
    path: "/", // ✅ Makes the cookie available on all routes
    httpOnly: true, // ✅ Prevents client-side access (security best practice)
    sameSite: "none", // ✅ Needed if frontend and backend are on different subdomains
    secure: true, // ✅ Required for HTTPS
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
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
