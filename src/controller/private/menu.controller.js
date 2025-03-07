import httpStatus from 'http-status';
import { MenuService } from '../../service/private/menu.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

const updateDropdown = catchAsync(async (req, res) => {
  const result = await MenuService.updateDropdown(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful!',
    meta: null,
    data: result,
  });
});

const deleteMenu = catchAsync(async (req, res) => {
  const result = await MenuService.deleteMenu(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful!',
    meta: null,
    data: result,
  });
});

const getMenus = catchAsync(async (req, res) => {
  const result = await MenuService.getMenus();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful!',
    meta: null,
    data: result,
  });
});

const getDropdowns = catchAsync(async (req, res) => {
  const result = await MenuService.getDropdowns();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'successful!',
    meta: null,
    data: result,
  });
});

const addDropdown = catchAsync(async (req, res) => {
  const result = await MenuService.addDropdown(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'updated successfully!',
    meta: null,
    data: result,
  });
});

const addMenu = catchAsync(async (req, res) => {
  const result = await MenuService.addMenu(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'updated successfully!',
    meta: null,
    data: result,
  });
});

export const MenuController = {
  updateDropdown,
  deleteMenu,
  getMenus,
  getDropdowns,
  addDropdown,
  addMenu,
};
