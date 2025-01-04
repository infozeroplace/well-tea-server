import express from "express";
import { ProductController } from "../../controller/public/product.controller.js";

const router = express.Router();

router.get("/product/list", ProductController.getProductList);

export const ProductRoutes = router;
