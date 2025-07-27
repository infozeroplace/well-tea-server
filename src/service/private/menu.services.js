import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import Dropdown from '../../model/dropdown.model.js';
import Menu from '../../model/menu.model.js';

const updateDropdown = async payload => {
  const { _id } = payload;

  const result = await Dropdown.findByIdAndUpdate(_id, payload);

  return result;
};

const deleteDropdown = async payload => {
  const { id } = payload;

  const result = await Dropdown.findByIdAndDelete(id);

  return result;
};

const deleteMenu = async payload => {
  const { id } = payload;

  const result = await Menu.findByIdAndDelete(id);

  return result;
};

const getMenus = async () => {
  const menus = await Menu.find({})
    .populate({
      path: 'category',
      select: 'assortment assortmentType',
    })
    .populate({
      path: 'dropdown',
      populate: [
        {
          path: 'productType.children',
          populate: [{ path: 'thumbnail', select: 'filepath alternateText' }],
        },
        {
          path: 'teaFlavor.children',
          populate: [{ path: 'thumbnail', select: 'filepath alternateText' }],
        },
        {
          path: 'attribute.children',
          populate: [{ path: 'thumbnail', select: 'filepath alternateText' }],
        },
        {
          path: 'teaFormat.children',
          populate: [{ path: 'thumbnail', select: 'filepath alternateText' }],
        },
        {
          path: 'teaBenefit.children',
          populate: [{ path: 'thumbnail', select: 'filepath alternateText' }],
        },
        {
          path: 'featured1.thumbnail',
          select: 'filepath alternateText',
        },
        {
          path: 'featured2.thumbnail',
          select: 'filepath alternateText',
        },
      ],
    });

  return menus;
};

const getDropdowns = async () => {
  const dropdowns = await Dropdown.find({})
    .populate({
      path: 'featured1.thumbnail',
      select: 'filepath alternateText',
    })
    .populate({
      path: 'featured2.thumbnail',
      select: 'filepath alternateText',
    });

  return dropdowns;
};

const addDropdown = async payload => {
  const dropdown = await Dropdown.create(payload);

  if (!dropdown)
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong!');

  return dropdown;
};

const addMenu = async payload => {
  const menu = await Menu.create(payload);

  if (!menu)
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong!');

  return menu;
};

export const MenuService = {
  updateDropdown,
  deleteDropdown,
  deleteMenu,
  getMenus,
  getDropdowns,
  addDropdown,
  addMenu,
};
