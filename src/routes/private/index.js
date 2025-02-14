import express from "express";
import { AssortmentRoutes } from "./assortment.routes.js";
import { BrewInstructionRoutes } from "./brewInstruction.routes.js";
import { ProductRoutes } from "./product.routes.js";
import { SystemRoutes } from "./system.routes.js";
import { UploadRoutes } from "./upload.routes.js";
import { MediaRoutes } from "./media.routes.js";
import { CartRoutes } from "./cart.routes.js";

const router = express.Router();

router.use(CartRoutes);
router.use(MediaRoutes);
router.use(BrewInstructionRoutes);
router.use(AssortmentRoutes);
router.use(SystemRoutes);
router.use(UploadRoutes);
router.use(ProductRoutes);

export const PrivateRoutes = router;
