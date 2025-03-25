import express from 'express';
import { CouponController } from '../../controller/public/coupon.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { CouponValidation } from '../../validation/coupon.validation.js';

const router = express.Router();

router.post(
  '/coupon/apply-coupon',
  validateRequest(CouponValidation.applyCoupon),
  CouponController.applyCoupon,
);

export const CouponRoutes = router;
