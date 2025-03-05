import express from 'express';
import { MenuController } from '../../controller/public/menu.controller.js';

const router = express.Router();

router.get('/menu/list', MenuController.menuList);

export const MenuRoutes = router;
