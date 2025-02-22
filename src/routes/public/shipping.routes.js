import express from 'express';
import { ShippingController } from '../../controller/public/shipping.controller.js';

const router = express.Router();

router.get('/shipping/list', ShippingController.getShippingMethodList);

export const ShippingRoutes = router;
