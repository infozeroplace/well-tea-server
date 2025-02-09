import express from "express";
import { ProfileController } from "../../controller/secure/profile.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import limiter from "../../middleware/limiter.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ProfileValidation } from "../../validation/profile.validation.js";

const router = express.Router();

router.put(
  "/profile/edit-social-password",
  auth(ENUM_USER_ROLE.USER),
  limiter(5, 10),
  validateRequest(ProfileValidation.editPasswordForSocialUserZodSchema),
  ProfileController.editPasswordForSocialUser
);

router.put(
  "/profile/edit-password",
  auth(ENUM_USER_ROLE.USER),
  limiter(5, 10),
  validateRequest(ProfileValidation.editPasswordZodSchema),
  ProfileController.editPassword
);

export const ProfileRoutes = router;
