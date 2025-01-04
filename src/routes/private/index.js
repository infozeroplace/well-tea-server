import express from "express";
import { ProductRoutes } from "./product.routes.js";
import { UploadRoutes } from "./upload.routes.js";

const router = express.Router();

router.use(UploadRoutes);

router.use(ProductRoutes);

export const PrivateRoutes = router;
