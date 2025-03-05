import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import { MenuService } from '../../service/public/menu.services.js';

const menuList = catchAsync(async (req, res) => {
  const result = await MenuService.menuList();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'list retrieved successfully',
    meta: null,
    data: result,
  });
});

export const MenuController = {
  menuList,
};
