import express from "express";
import { AssortmentRoutes } from "./assortment.routes.js";
import { ProductRoutes } from "./product.routes.js";
import { SystemRoutes } from "./system.routes.js";
import { UploadRoutes } from "./upload.routes.js";

const router = express.Router();

router.use(AssortmentRoutes);
router.use(SystemRoutes);
router.use(UploadRoutes);
router.use(ProductRoutes);

export const PrivateRoutes = router;
