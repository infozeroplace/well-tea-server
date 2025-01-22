import express from "express";
import { ProductController } from "../../controller/private/product.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ProductValidation } from "../../validation/product.validation.js";

const router = express.Router();

router.put(
  "/product/edit",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  // validateRequest(ProductValidation.addProductSchema),
  ProductController.editProduct
);

router.get(
  "/product/all-list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ProductController.getAllProductList
);

router.get(
  "/product/list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ProductController.getProductList
);

router.delete(
  "/product/delete",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ProductValidation.deleteProductSchema),
  ProductController.deleteProduct
);

router.post(
  "/product/add",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(ProductValidation.addProductSchema),
  ProductController.addProduct
);

router.get(
  "/product/:id",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  ProductController.getProduct
);

export const ProductRoutes = router;
