import express from 'express';
import { ProductController } from '../../controller/public/product.controller.js';

const router = express.Router();

router.get('/product/all-list', ProductController.getAllProducts);

router.get('/product/list', ProductController.getProductList);

router.post(
  '/product/get-related-products',
  ProductController.getRelatedProductList,
);

router.get('/product/:slug', ProductController.getProduct);

export const ProductRoutes = router;
