import express from "express";
import { SystemController } from "../../controller/private/system.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.put(
  "/system/update-offer-setting",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateOfferSetting
);

router.put(
  "/system/update-hero-setting",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateHeroSetting
);

router.get(
  "/system/get-system-configuration",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.getSystemConfiguration
);

export const SystemRoutes = router;
