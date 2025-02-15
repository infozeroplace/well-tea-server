import express from 'express';
import { WishlistController } from '../../controller/private/wishlist.controller.js';

const router = express.Router();

router.get('/wishlist/list', WishlistController.getWishlist);

export const WishlistRoutes = router;
