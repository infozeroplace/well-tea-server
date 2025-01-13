import express from "express";
import { CategoryController } from "../../controller/private/category.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.delete(
  "/category/delete-category",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CategoryController.deleteCategory
);

router.get(
  "/category/list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CategoryController.getCategoryList
);

router.post(
  "/category/add-category",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  CategoryController.addCategory
);

export const CategoryRoutes = router;
