import express from 'express';
import { OrderController } from '../../controller/secure/order.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { OrderValidation } from '../../validation/order.validation.js';

const router = express.Router();

router.post(
  '/order/apply-coupon',
  auth(ENUM_USER_ROLE.USER),
  validateRequest(OrderValidation.applyCoupon),
  OrderController.applyCoupon,
);

router.get(
  '/order/list',
  auth(ENUM_USER_ROLE.USER),
  OrderController.getOrderList,
);

export const OrderRoutes = router;
