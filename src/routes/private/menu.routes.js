import express from 'express';
import { MenuController } from '../../controller/private/menu.controller.js';
const router = express.Router();

router.put('/menu/update-dropdown', MenuController.updateDropdown);

router.delete('/menu/delete-menu', MenuController.deleteMenu);

router.get('/menu/get-menus', MenuController.getMenus);

router.get('/menu/get-dropdowns', MenuController.getDropdowns);

router.post('/menu/add-dropdown', MenuController.addDropdown);

router.post('/menu/add-menu', MenuController.addMenu);

export const MenuRoutes = router;
