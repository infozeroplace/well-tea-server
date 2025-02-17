export const productSearchableFields = [
  'urlParameter',
  'sku',
  'title',
  'category',
  'attribute',
  'productType',
  'teaFormat',
  'teaFlavor',
  'teaIngredient',
  'teaBenefit',
  'origin',
  'originLocation',
];

export const productFilterableField = [
  'searchTerm',
  'category',
  'sku',
  'attribute',
  'productType',
  'teaFormat',
  'teaFlavor',
  'teaIngredient',
  'isPublished',
  'teaBenefit',
  'origin',
  'isStock',
  'isNewProduct',
  'isBestSeller',
  'isFeatured',
  'isSale',
  'isSubscription',
  'ratings',
  'unitPrices',
  'price',
];

export const mediaUnset = {
  $unset: [
    'originalname',
    'filename',
    'filetype',
    'filesize',
    'media',
    'dimensions',
    '__v',
    'createdAt',
    'updatedAt',
  ],
};

export const mediaLookupPipeline = [
  mediaUnset,
  {
    $lookup: {
      from: 'media',
      localField: 'thumbnail',
      foreignField: '_id',
      as: 'thumbnail',
      pipeline: [mediaUnset],
    },
  },
];
