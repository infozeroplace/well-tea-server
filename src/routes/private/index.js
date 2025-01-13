import express from "express";
import { ProductRoutes } from "./product.routes.js";
import { UploadRoutes } from "./upload.routes.js";
import { SystemRoutes } from "./system.routes.js";
import { CategoryRoutes } from "./category.routes.js";

const router = express.Router();

router.use(CategoryRoutes);
router.use(SystemRoutes);
router.use(UploadRoutes);
router.use(ProductRoutes);

export const PrivateRoutes = router;
