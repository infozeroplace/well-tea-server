import express from 'express';
import { OrderController } from '../../controller/private/order.controller.js';
import { ProductController } from '../../controller/private/product.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/order/list',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  OrderController.getOrderList,
);

router.get(
  '/order/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  OrderController.getOrder,
);

export const OrderRoutes = router;
