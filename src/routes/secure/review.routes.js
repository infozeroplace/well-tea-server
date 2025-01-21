import express from "express";
import { ReviewController } from "../../controller/secure/review.controller.js";
import { ENUM_USER_ROLE } from "../../enum/user.js";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ReviewValidation } from "../../validation/review.validation.js";

const router = express.Router();

router.post(
  "/review/add-review",
  auth(ENUM_USER_ROLE.USER),
  validateRequest(ReviewValidation.addReviewSchema),
  ReviewController.addReview
);

export const ReviewRoutes = router;
