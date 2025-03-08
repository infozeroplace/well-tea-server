import express from 'express';
import { PostController } from '../../controller/public/post.controller.js';

const router = express.Router();

router.get('/post/list', PostController.getList);

export const PostRoutes = router;
