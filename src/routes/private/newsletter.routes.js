import express from 'express';
import { NewsletterController } from '../../controller/private/newsletter.controller.js';
import validateRequest from '../../middleware/validateRequest.js';
import { NewsletterValidation } from '../../validation/newsletter.validation.js';

const router = express.Router();

router.post(
  '/newsletter/send-bulk-email',
  validateRequest(NewsletterValidation.sendBulkEmailZodSchema),
  NewsletterController.sendBulkEmail,
);

router.post(
  '/newsletter/send-specific-bulk-email',
  validateRequest(NewsletterValidation.sendSpecificBulkEmailZodSchema),
  NewsletterController.sendSpecificBulkEmail,
);

router.get(
  '/newsletter/get-subscribed-users',
  NewsletterController.getSubscribedUsers,
);

export const NewsletterRoutes = router;
