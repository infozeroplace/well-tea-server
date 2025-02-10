import express from "express";
import { AuthController } from "../../controller/public/auth.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import limiter from "../../middleware/limiter.js";
import validateRequest from "../../middleware/validateRequest.js";
import { AuthValidation } from "../../validation/auth.validation.js";
const router = express.Router();

router.post(
  "/auth/logout",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(AuthValidation.logOutZodSchema),
  AuthController.logout
);

router.post(
  "/auth/reset-password",
  limiter(5, 10),
  validateRequest(AuthValidation.resetPasswordZodSchema),
  AuthController.resetPassword
);

router.post(
  "/auth/forgot-password",
  limiter(5, 10),
  validateRequest(AuthValidation.forgotPasswordZodSchema),
  AuthController.forgotPassword
);

router.post(
  "/auth/sign-up",
  limiter(5, 10),
  validateRequest(AuthValidation.registerZodSchema),
  AuthController.register
);

router.post(
  "/auth/sign-in",
  limiter(5, 50),
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.login
);

router.post(
  "/auth/admin/sign-in",
  limiter(5, 50),
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.adminLogin
);

router.post(
  "/auth/google-sign-in",
  limiter(5, 50),
  validateRequest(AuthValidation.googleLoginZodSchema),
  AuthController.googleLogin
);

router.get("/auth/refresh/token", AuthController.refreshToken);

export const AuthRoutes = router;
