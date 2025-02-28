import express from 'express';
import { AddressRoutes } from './address.routes.js';
import { OrderRoutes } from './order.routes.js';
import { ProfileRoutes } from './profile.routes.js';
import { ReviewRoutes } from './review.routes.js';

const router = express.Router();

router.use(OrderRoutes);
router.use(ProfileRoutes);
router.use(AddressRoutes);
router.use(ReviewRoutes);

export const SecureRoutes = router;
