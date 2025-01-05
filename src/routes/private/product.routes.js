import express from "express";
import { ProductController } from "../../controller/private/product.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ProductValidation } from "../../validation/product.validation.js";

const router = express.Router();

router.delete(
  "/product/tea/delete",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ProductValidation.deleteTeaSchema),
  ProductController.deleteProductTea
);

router.post(
  "/product/tea/add",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ProductValidation.addTeaSchema),
  ProductController.addProductTea
);

export const ProductRoutes = router;
