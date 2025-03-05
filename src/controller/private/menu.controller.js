import httpStatus from 'http-status';
import { MenuService } from '../../service/private/menu.services.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';

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
  addMenu,
};
