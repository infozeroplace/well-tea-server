import express from 'express';
import { AssortmentRoutes } from './assortment.routes.js';
import { BrewInstructionRoutes } from './brewInstruction.routes.js';
import { CartRoutes } from './cart.routes.js';
import { CustomerRoutes } from './customer.routes.js';
import { MediaRoutes } from './media.routes.js';
import { NewsletterRoutes } from './newsletter.routes.js';
import { OtpRoutes } from './otp.routes.js';
import { ProductRoutes } from './product.routes.js';
import { ProfileRoutes } from './profile.routes.js';
import { ShippingRoutes } from './shipping.routes.js';
import { SystemRoutes } from './system.routes.js';
import { UploadRoutes } from './upload.routes.js';
import { WishlistRoutes } from './wishlist.routes.js';
import { CouponRoutes } from './coupon.routes.js';
import { OrderRoutes } from './order.routes.js';
import { BlogRoutes } from './blog.routes.js';

const router = express.Router();

router.use(BlogRoutes);
router.use(OrderRoutes);
router.use(CouponRoutes);
router.use(ShippingRoutes);
router.use(NewsletterRoutes);
router.use(OtpRoutes);
router.use(ProfileRoutes);
router.use(CustomerRoutes);
router.use(WishlistRoutes);
router.use(CartRoutes);
router.use(MediaRoutes);
router.use(BrewInstructionRoutes);
router.use(AssortmentRoutes);
router.use(SystemRoutes);
router.use(UploadRoutes);
router.use(ProductRoutes);

export const PrivateRoutes = router;
