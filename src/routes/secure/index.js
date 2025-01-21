import express from "express";
import { ReviewRoutes } from "./review.routes.js";

const router = express.Router();


router.use(ReviewRoutes);


export const SecureRoutes = router;
