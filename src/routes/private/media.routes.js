import express from "express";
import { MediaController } from "../../controller/private/media.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import {
  imageDimensionMiddleware,
  multipleImageMiddleware,
} from "../../middleware/multer.js";

const router = express.Router();


router.get(
  "/media/get-vps-resources",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MediaController.getVPSResource
);

router.delete(
  "/media/delete-media-images",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MediaController.deleteMediaImages
);

router.delete(
  "/media/delete-media-image",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MediaController.deleteMediaImage
);

router.put(
  "/media/update-media-image",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MediaController.updateMediaImage
);

router.get(
  "/media/get-image-list",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MediaController.getImageList
);

router.post(
  "/media/upload/multiple/image",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  multipleImageMiddleware,
  imageDimensionMiddleware,
  MediaController.multipleImageUpload
);

router.get(
  "/media/download/:filename",
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  MediaController.downloadImage
);

export const MediaRoutes = router;
