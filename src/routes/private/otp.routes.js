import express from 'express';
import { OtpController } from '../../controller/private/otp.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import validateRequest from "../../middleware/validateRequest.js";
import { OtpValidation } from '../../validation/otp.validation.js';

const router = express.Router();

router.post(
  '/otp/send-to-email-change',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(OtpValidation.email),
  OtpController.sendToEmailChange,
);

export const OtpRoutes = router;
