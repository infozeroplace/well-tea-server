import express from 'express';
import { CartController } from '../../controller/public/cart.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { CartValidation } from '../../validation/cart.validation.js';
const router = express.Router();

router.post(
  '/cart/add-to-cart',
  validateRequest(CartValidation.addToCartSchema),
  CartController.addToCart,
);

router.get('/cart/wtc', CartController.wtc);

export const CartRoutes = router;
