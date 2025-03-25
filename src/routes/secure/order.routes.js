import express from 'express';
import { OrderController } from '../../controller/secure/order.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/order/list',
  auth(ENUM_USER_ROLE.USER),
  OrderController.getOrderList,
);

export const OrderRoutes = router;
