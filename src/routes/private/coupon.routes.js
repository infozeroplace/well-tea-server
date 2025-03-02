import express from 'express';
import { CouponController } from '../../controller/private/coupon.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { CouponValidation } from '../../validation/coupon.validation.js';

const router = express.Router();

router.delete(
  '/coupon/delete-coupons',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CouponController.deleteCoupons,
);

router.delete(
  '/coupon/delete-coupon',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CouponController.deleteCoupon,
);

router.get(
  '/coupon/list',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CouponController.getList,
);

router.post(
  '/coupon/add-coupon',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CouponValidation.addCoupon),
  CouponController.addCoupon,
);

export const CouponRoutes = router;
