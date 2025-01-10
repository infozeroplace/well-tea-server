import express from "express";
import { AuthRoutes } from "./auth.routes.js";
import { ProductRoutes } from "./product.routes.js";
import { SystemRoutes } from "./system.routes.js";

const router = express.Router();

router.use(SystemRoutes);
router.use(ProductRoutes);
router.use(AuthRoutes);

export const PublicRoutes = router;
