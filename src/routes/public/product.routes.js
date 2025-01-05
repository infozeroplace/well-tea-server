import express from "express";
import { ProductController } from "../../controller/public/product.controller.js";

const router = express.Router();

router.get("/product/tea/list", ProductController.getProductTeaList);

export const ProductRoutes = router;
