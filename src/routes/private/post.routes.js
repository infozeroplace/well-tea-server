import express from 'express';
import { PostController } from '../../controller/private/post.controller.js';
import { ShippingController } from '../../controller/private/shipping.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';
import validateRequest from '../../middleware/validateRequest.js';
import { PostValidation } from '../../validation/post.validation.js';

const router = express.Router();

router.get(
  '/post/list',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  PostController.getList,
);

router.delete(
  '/post/delete-posts',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(PostValidation.deletePosts),
  PostController.deletePosts,
);

router.delete(
  '/post/delete-post',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(PostValidation.deletePost),
  PostController.deletePost,
);

router.put(
  '/post/edit-post',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(PostValidation.editPost),
  PostController.editPost,
);

router.post(
  '/post/add-post',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(PostValidation.addPost),
  PostController.addPost,
);

export const PostRoutes = router;
