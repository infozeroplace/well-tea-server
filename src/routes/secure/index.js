import express from "express";
import { ReviewRoutes } from "./review.routes.js";
import { AddressRoutes } from "./address.routes.js";

const router = express.Router();


router.use(AddressRoutes);
router.use(ReviewRoutes);


export const SecureRoutes = router;
