import express from 'express';
import { NewsletterController } from '../../controller/private/newsletter.controller.js';
const router = express.Router();

router.get(
  '/newsletter/get-subscribed-users',
  NewsletterController.getSubscribedUsers,
);

export const NewsletterRoutes = router;
