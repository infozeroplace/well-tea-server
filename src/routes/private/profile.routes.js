import express from 'express';
import { ProfileController } from '../../controller/private/profile.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import limiter from '../../middleware/limiter.js';
import validateRequest from '../../middleware/validateRequest.js';
import { ProfileValidation } from '../../validation/profile.validation.js';

const router = express.Router();

router.put(
  '/profile/edit-password',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  limiter(5, 10),
  validateRequest(ProfileValidation.editPasswordZodSchema),
  ProfileController.editPassword,
);

router.put(
  '/profile/edit-email',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ProfileValidation.editEmailZodSchema),
  ProfileController.editEmail,
);

export const ProfileRoutes = router;
