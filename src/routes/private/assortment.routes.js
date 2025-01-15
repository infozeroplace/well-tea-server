import express from "express";
import { AssortmentController } from "../../controller/private/assortment.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.delete(
  "/assortment/delete-assortment",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AssortmentController.deleteAssortment
);

router.get(
  "/assortment/list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AssortmentController.getAssortmentList
);

router.post(
  "/assortment/add-assortment",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AssortmentController.addAssortment
);

export const AssortmentRoutes = router;