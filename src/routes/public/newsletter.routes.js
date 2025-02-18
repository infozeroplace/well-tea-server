import express from 'express';
import { NewsletterController } from '../../controller/public/newsletter.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { NewsletterValidation } from '../../validation/newsletter.validation.js';
const router = express.Router();

router.post(
  '/newsletter/subscribe',
  validateRequest(NewsletterValidation.emailZodSchema),
  NewsletterController.subscribe,
);

export const NewsletterRoutes = router;
