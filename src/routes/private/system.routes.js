import express from "express";
import { SystemController } from "../../controller/private/system.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.put(
  "/system/update-company-service",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateCompanyService
);

router.put(
  "/system/update-why-choose-us",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateWhyChooseUs
);

router.put(
  "/system/update-secondary-logo",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateSecondaryLogo
);

router.put(
  "/system/update-top-notification",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateNotification
);

router.put(
  "/system/update-featured-setting",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateFeaturedSectionSetting
);

router.put(
  "/system/update-logo",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateLogo
);

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
