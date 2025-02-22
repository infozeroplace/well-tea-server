import express from 'express';
import { AuthRoutes } from './auth.routes.js';
import { CartRoutes } from './cart.routes.js';
import { ProductRoutes } from './product.routes.js';
import { SystemRoutes } from './system.routes.js';
import { WishlistRoutes } from './wishlist.routes.js';
import { NewsletterRoutes } from './newsletter.routes.js';
import { ShippingRoutes } from './shipping.routes.js';
import { PaymentRoutes } from './payment.routes.js';

const router = express.Router();

router.use(PaymentRoutes);
router.use(ShippingRoutes);
router.use(NewsletterRoutes);
router.use(CartRoutes);
router.use(WishlistRoutes);
router.use(SystemRoutes);
router.use(ProductRoutes);
router.use(AuthRoutes);

export const PublicRoutes = router;
