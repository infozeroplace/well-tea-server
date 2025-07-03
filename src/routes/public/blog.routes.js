import express from "express";
import { BlogController } from "../../controller/public/blog.controller.js";

const router = express.Router();

router.get("/blog/all-blog-list", BlogController.getAllBlogs);

router.get("/blog/blog-list", BlogController.blogList);

router.get("/blog/:id", BlogController.blog);

export const BlogRoutes = router;
