import { System } from '../../model/system.model.js';

const getTeaTypes = async () => {
  const system = await System.findOne({ systemId: 'system-1' }).populate(
    'exploreTeaOptions',
  );

  return system.exploreTeaOptions.map(a => a.assortment);
};

const getSystemConfig = async () => {
  const pipeline = [
    {
      $match: { systemId: 'system-1' },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'logo',
        foreignField: '_id',
        as: 'logo',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'secondaryLogo',
        foreignField: '_id',
        as: 'secondaryLogo',
      },
    },
    {
      $unwind: { path: '$hero', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'hero.bannerImagePath',
        foreignField: '_id',
        as: 'hero.bannerImagePath',
      },
    },
    {
      $unwind: { path: '$companyService', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'companyService.iconPath',
        foreignField: '_id',
        as: 'companyService.iconPath',
      },
    },
    {
      $unwind: { path: '$whyChooseUs', preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'whyChooseUs.iconPath',
        foreignField: '_id',
        as: 'whyChooseUs.iconPath',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'whyChooseUs.imagePath',
        foreignField: '_id',
        as: 'whyChooseUs.imagePath',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'offer.offerOne.thumbnail',
        foreignField: '_id',
        as: 'offer.offerOne.thumbnail',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'offer.offerTwo.thumbnail',
        foreignField: '_id',
        as: 'offer.offerTwo.thumbnail',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'offer.offerThree.thumbnail',
        foreignField: '_id',
        as: 'offer.offerThree.thumbnail',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'offer.offerFour.thumbnail',
        foreignField: '_id',
        as: 'offer.offerFour.thumbnail',
      },
    },
    {
      $lookup: {
        from: 'media',
        localField: 'featured.bannerImage',
        foreignField: '_id',
        as: 'featured.bannerImage',
      },
    },
    {
      $group: {
        _id: '$_id',
        systemId: { $first: '$systemId' },
        logo: { $first: '$logo' },
        secondaryLogo: { $first: '$secondaryLogo' },
        filters: { $first: '$filters' },
        faqs: { $first: '$faqs' },
        offer: { $first: '$offer' },
        featured: { $first: '$featured' },
        topNotifications: { $first: '$topNotifications' },
        hero: {
          $addToSet: {
            _id: '$hero._id',
            bannerImagePath: '$hero.bannerImagePath',
            bannerImageTitle: '$hero.bannerImageTitle',
            bannerImageDescription: '$hero.bannerImageDescription',
            bannerImageButtonText: '$hero.bannerImageButtonText',
            bannerImageButtonUrl: '$hero.bannerImageButtonUrl',
          },
        },
        whyChooseUs: {
          $addToSet: {
            _id: '$whyChooseUs._id',
            title: '$whyChooseUs.title',
            description: '$whyChooseUs.description',
            iconPath: '$whyChooseUs.iconPath',
            imagePath: '$whyChooseUs.imagePath',
          },
        },
        companyService: {
          $addToSet: {
            _id: '$companyService._id',
            title: '$companyService.title',
            description: '$companyService.description',
            iconPath: '$companyService.iconPath',
          },
        },
        privacyPolicy: { $first: '$privacyPolicy' },
        termsAndConditions: { $first: '$termsAndConditions' },
        cookiesPolicy: { $first: '$cookiesPolicy' },
        returnAndRefund: { $first: '$returnAndRefund' },
        subscriptionPolicy: { $first: '$subscriptionPolicy' },
        deliveryPolicy: { $first: '$deliveryPolicy' },
      },
    },
    {
      $addFields: {
        filters: {
          $concatArrays: [
            [
              {
                category: 'all',
                title: 'Price',
                key: 'price',
                options: [
                  { _id: '1', param: '0-25' },
                  { _id: '2', param: '26-40' },
                  { _id: '3', param: '41-65' },
                  { _id: '4', param: '66-75' },
                  { _id: '5', param: '66-85' },
                  { _id: '6', param: '76-95' },
                  { _id: '7', param: '76-100' },
                ],
              },
            ],
            '$filters',
          ],
        },
      },
    },
  ];

  const result = await System.aggregate(pipeline);

  // console.log(result[0]);

  return result[0];
};

export const SystemService = {
  getTeaTypes,
  getSystemConfig,
};
