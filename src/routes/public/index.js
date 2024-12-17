import express from "express";
import { AuthRoutes } from "./auth.routes.js";

const router = express.Router();

router.use(AuthRoutes);

export const PublicRoutes = router;
