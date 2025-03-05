const menuList = async () => {
  const mainCategories = [
    {
      category: {
        assortment: 'tea',
      },
      pattern: true,
    },
    {
      category: {
        assortment: 'teaware',
      },
      pattern: true,
    },
    {
      category: {
        assortment: 'gift',
      },
      pattern: true,
    },
  ];

  return mainCategories;
};

export const MenuService = {
  menuList,
};
