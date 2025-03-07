import express from "express";
import { SystemController } from "../../controller/private/system.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.put(
  "/system/update-section-banner",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateSectionBanner
);

router.put(
  "/system/update-explore-tea-options",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateExploreTeaOptions
);

router.put(
  "/system/update-filter",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateFilter
);

router.put(
  "/system/update-faq",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateFAQ
);

router.put(
  "/system/update-delivery-policy",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateDeliveryPolicy
);

router.put(
  "/system/update-subscription-policy",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateSubscriptionPolicy
);

router.put(
  "/system/update-return-and-refund",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateReturnAndRefundPolicy
);

router.put(
  "/system/update-cookies-policy",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateCookiesPolicy
);

router.put(
  "/system/update-terms-and-conditions",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updateTermsAndConditions
);

router.put(
  "/system/update-privacy-policy",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  SystemController.updatePrivacyPolicy
);

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
