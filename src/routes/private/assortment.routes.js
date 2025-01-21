import express from "express";
import { AssortmentController } from "../../controller/private/assortment.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { AssortmentValidation } from "../../validation/assortment.validation.js";

const router = express.Router();

router.delete(
  "/assortment/delete-assortments",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AssortmentController.deleteAssortments
);

router.get(
  "/assortment/all-list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AssortmentController.getAllAssortmentList
);

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
  validateRequest(AssortmentValidation.addAssortmentSchema),
  AssortmentController.addAssortment
);

export const AssortmentRoutes = router;
