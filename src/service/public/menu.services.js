import Menu from '../../model/menu.model.js';

const menuList = async () => {
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

export const MenuService = {
  menuList,
};
