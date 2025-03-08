import express from 'express';
import { AuthRoutes } from './auth.routes.js';
import { BlogRoutes } from './blog.routes.js';
import { CommonRoutes } from './common.routes.js';
import { MenuRoutes } from './menu.routes.js';
import { NewsletterRoutes } from './newsletter.routes.js';
import { PaymentRoutes } from './payment.routes.js';
import { PostRoutes } from './post.routes.js';
import { ProductRoutes } from './product.routes.js';
import { ShippingRoutes } from './shipping.routes.js';
import { SystemRoutes } from './system.routes.js';
import { TestRoutes } from './test.routes.js';

const router = express.Router();

router.use(PostRoutes);
router.use(MenuRoutes);
router.use(TestRoutes);
router.use(BlogRoutes);
router.use(CommonRoutes);
router.use(PaymentRoutes);
router.use(ShippingRoutes);
router.use(NewsletterRoutes);
router.use(SystemRoutes);
router.use(ProductRoutes);
router.use(AuthRoutes);

export const PublicRoutes = router;
