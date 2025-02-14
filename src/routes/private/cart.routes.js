import express from 'express';
import { CartController } from '../../controller/private/cart.controller.js';

const router = express.Router();

router.get('/cart/list', CartController.getCartList);

export const CartRoutes = router;
