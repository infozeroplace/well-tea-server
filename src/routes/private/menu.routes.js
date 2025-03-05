import express from 'express';
import { MenuController } from '../../controller/private/menu.controller.js';
const router = express.Router();

router.post('/menu/add-menu', MenuController.addMenu);

export const MenuRoutes = router;
