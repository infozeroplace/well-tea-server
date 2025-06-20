import config from '../config/index.js';

export const corsOptions = {
  origin: config.origins,
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'authorization'],
};

export const countries = [
  'afghanistan',
  'albania',
  'algeria',
  'andorra',
  'angola',
  'antigua and barbuda',
  'argentina',
  'armenia',
  'australia',
  'austria',
  'azerbaijan',
  'bahamas',
  'bahrain',
  'bangladesh',
  'barbados',
  'belarus',
  'belgium',
  'belize',
  'benin',
  'bhutan',
  'bolivia',
  'bosnia and herzegovina',
  'botswana',
  'brazil',
  'brunei darussalam',
  'bulgaria',
  'burkina faso',
  'burundi',
  'cabo verde',
  'cambodia',
  'cameroon',
  'canada',
  'central african republic',
  'chad',
  'chile',
  'china',
  'colombia',
  'comoros',
  'congo',
  'congo, democratic republic of the',
  'costa rica',
  'croatia',
  'cuba',
  'cyprus',
  'czech republic',
  'denmark',
  'djibouti',
  'dominica',
  'dominican republic',
  'ecuador',
  'egypt',
  'el salvador',
  'equatorial guinea',
  'eritrea',
  'estonia',
  'eswatini',
  'ethiopia',
  'fiji',
  'finland',
  'france',
  'gabon',
  'gambia',
  'georgia',
  'germany',
  'ghana',
  'greece',
  'grenada',
  'guatemala',
  'guinea',
  'guinea-bissau',
  'guyana',
  'haiti',
  'honduras',
  'hungary',
  'iceland',
  'india',
  'indonesia',
  'iran',
  'iraq',
  'ireland',
  'israel',
  'italy',
  'jamaica',
  'japan',
  'jordan',
  'kazakhstan',
  'kenya',
  'kiribati',
  "korea, democratic people's republic of",
  'korea, republic of',
  'kuwait',
  'kyrgyzstan',
  "lao people's democratic republic",
  'latvia',
  'lebanon',
  'lesotho',
  'liberia',
  'libya',
  'liechtenstein',
  'lithuania',
  'luxembourg',
  'madagascar',
  'malawi',
  'malaysia',
  'maldives',
  'mali',
  'malta',
  'marshall islands',
  'mauritania',
  'mauritius',
  'mexico',
  'micronesia',
  'moldova',
  'monaco',
  'mongolia',
  'montenegro',
  'morocco',
  'mozambique',
  'myanmar',
  'namibia',
  'nauru',
  'nepal',
  'netherlands',
  'new zealand',
  'nicaragua',
  'niger',
  'nigeria',
  'north macedonia',
  'norway',
  'oman',
  'pakistan',
  'palau',
  'palestine',
  'panama',
  'papua new guinea',
  'paraguay',
  'peru',
  'philippines',
  'poland',
  'portugal',
  'qatar',
  'romania',
  'russian federation',
  'rwanda',
  'saint kitts and nevis',
  'saint lucia',
  'saint vincent and the grenadines',
  'samoa',
  'san marino',
  'sao tome and principe',
  'saudi arabia',
  'senegal',
  'serbia',
  'seychelles',
  'sierra leone',
  'singapore',
  'sint maarten',
  'slovakia',
  'slovenia',
  'solomon islands',
  'somalia',
  'south africa',
  'south sudan',
  'spain',
  'sri lanka',
  'sudan',
  'suriname',
  'sweden',
  'switzerland',
  'syria',
  'taiwan',
  'tajikistan',
  'tanzania',
  'thailand',
  'timor-leste',
  'togo',
  'tonga',
  'trinidad and tobago',
  'tunisia',
  'turkey',
  'turkmenistan',
  'tuvalu',
  'uganda',
  'ukraine',
  'united arab emirates',
  'united kingdom',
  'united states',
  'uruguay',
  'uzbekistan',
  'vanuatu',
  'vatican city',
  'venezuela',
  'vietnam',
  'yemen',
  'zambia',
  'zimbabwe',
];

export const cartPipeline = [
  {
    $lookup: {
      from: 'products',
      let: { productIds: '$items.productId' }, // Pass product IDs
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $in: ['$_id', '$$productIds'] }, // Match product IDs
                { $eq: ['$isPublished', true] }, // Only published products
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'media', // Assuming your media collection is named "media"
            localField: 'thumbnails',
            foreignField: '_id',
            as: 'thumbnails',
          },
        },
        {
          $group: {
            _id: '$_id',
            urlParameter: { $first: '$urlParameter' },
            title: { $first: '$title' },
            thumbnails: { $first: '$thumbnails' },
            isSale: { $first: '$isSale' },
            isSubscription: { $first: '$isSubscription' },
            isMultiDiscount: { $first: '$isMultiDiscount' },
            sale: { $first: '$sale' },
            subscriptionSale: { $first: '$subscriptionSale' },
            multiDiscountQuantity: { $first: '$multiDiscountQuantity' },
            multiDiscountAmount: { $first: '$multiDiscountAmount' },
            unitPrices: { $first: '$unitPrices' },
            subscriptions: { $first: '$subscriptions' },
          },
        },
        {
          $addFields: {
            unitPrices: {
              $map: {
                input: '$unitPrices',
                as: 'unitPrice',
                in: {
                  _id: '$$unitPrice._id',
                  unit: '$$unitPrice.unit',
                  price: '$$unitPrice.price',
                  salePrice: {
                    $cond: {
                      if: '$isSale',
                      then: {
                        $round: [
                          {
                            $subtract: [
                              '$$unitPrice.price',
                              {
                                $multiply: [
                                  '$$unitPrice.price',
                                  { $divide: ['$sale', 100] },
                                ],
                              },
                            ],
                          },
                          2,
                        ],
                      },
                      else: 0,
                    },
                  },
                  subscriptionPrice: {
                    $cond: {
                      if: '$isSubscription',
                      then: {
                        $round: [
                          {
                            $subtract: [
                              '$$unitPrice.price',
                              {
                                $multiply: [
                                  '$$unitPrice.price',
                                  { $divide: ['$subscriptionSale', 100] },
                                ],
                              },
                            ],
                          },
                          2,
                        ],
                      },
                      else: 0,
                    },
                  },
                },
              },
            },
          },
        },
      ],
      as: 'productData',
    },
  },
  {
    $addFields: {
      items: {
        $map: {
          input: '$items',
          as: 'item',
          in: {
            $mergeObjects: [
              '$$item',
              {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$productData',
                      as: 'prod',
                      cond: { $eq: ['$$prod._id', '$$item.productId'] },
                    },
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
    },
  },
  {
    $project: {
      productData: 0,
    },
  },
];
