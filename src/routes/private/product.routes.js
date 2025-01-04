import express from "express";
import { ProductController } from "../../controller/private/product.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/product/tea/add",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ProductController.addProductTea
);

export const ProductRoutes = router;
