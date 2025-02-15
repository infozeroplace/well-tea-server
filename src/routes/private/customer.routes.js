import express from 'express';
import { CustomerController } from '../../controller/private/customer.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.get(
  '/customer/list',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CustomerController.getCustomerList,
);

router.put(
  '/customer/update-status/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CustomerController.updateStatus,
);

export const CustomerRoutes = router;
