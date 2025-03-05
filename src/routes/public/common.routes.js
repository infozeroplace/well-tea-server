import express from 'express';
import { CommonController } from '../../controller/public/common.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { CommonValidation } from '../../validation/common.validation.js';
const router = express.Router();

router.get('/auth/instagram/callback', CommonController.getIGAccessToken);

router.post(
  '/common/cart/add-to-cart',
  validateRequest(CommonValidation.addToCartSchema),
  CommonController.addToCart,
);

router.post(
  '/common/wishlist/add-to-wishlist',
  validateRequest(CommonValidation.addToWishlistSchema),
  CommonController.addToWishlist,
);

router.get('/common/wt', CommonController.wt);

export const CommonRoutes = router;
