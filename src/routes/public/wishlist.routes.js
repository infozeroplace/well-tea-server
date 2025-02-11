import express from 'express';
import { WishlistController } from '../../controller/public/wishlist.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { WishlistValidation } from '../../validation/wishlist.validation.js';
const router = express.Router();

router.post(
  '/wishlist/add-to-wishlist',
  validateRequest(WishlistValidation.addToWishlistSchema),
  WishlistController.addToWishlist,
);

router.get('/wishlist/wtw', WishlistController.wtw);

export const WishlistRoutes = router;
