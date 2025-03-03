import express from 'express';
import { BlogController } from '../../controller/private/blog.controller.js';
import { ENUM_USER_ROLE } from '../../enum/user.js';
import auth from '../../middleware/auth.js';

const router = express.Router();

router.put(
  '/blog/edit',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.editBlog,
);

router.delete(
  '/blog/delete-blogs',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.deleteBlogs,
);

router.get(
  '/blog/blog-list',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.blogList,
);

router.post(
  '/blog/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.addBlog,
);

router.delete(
  '/blog/delete-blog/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.deleteBlog,
);

router.get('/blog/:id', auth(ENUM_USER_ROLE.SUPER_ADMIN), BlogController.blog);

export const BlogRoutes = router;
