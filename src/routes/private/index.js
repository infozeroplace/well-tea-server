import express from "express";
import { ProductRoutes } from "./product.routes.js";
import { UploadRoutes } from "./upload.routes.js";
import { SystemRoutes } from "./system.routes.js";

const router = express.Router();

router.use(SystemRoutes);

router.use(UploadRoutes);

router.use(ProductRoutes);

export const PrivateRoutes = router;
