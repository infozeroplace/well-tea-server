import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import Menu from '../../model/menu.model.js';

const addMenu = async payload => {
  const menu = await Menu.create(payload);

  if (!menu)
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong!');

  return menu;
};

export const MenuService = {
  addMenu,
};
