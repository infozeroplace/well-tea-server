import express from 'express';
import { ShippingController } from '../../controller/private/shipping.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { ShippingValidation } from '../../validation/shipping.validation.js';

const router = express.Router();

router.put(
  '/shipping/edit-shipping',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ShippingController.editShipping,
);

router.delete(
  '/shipping/delete-shippings',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ShippingController.deleteShippings,
);

router.delete(
  '/shipping/delete-shipping',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ShippingController.deleteShipping,
);

router.get(
  '/shipping/list',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ShippingController.getShippingMethodList,
);

router.post(
  '/shipping/add-method',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ShippingValidation.addShippingSchema),
  ShippingController.addShippingMethod,
);

export const ShippingRoutes = router;
