import httpStatus from 'http-status';
import ApiError from '../../error/ApiError.js';
import { System } from '../../model/system.model.js';

const updateExploreTeaOptions = async payload => {
  const { exploreTeaOptions } = payload;

  const existing = await System.findOne({
    systemId: 'system-1',
  });

  if (!existing) {
    const result = await System.create({
      systemId: 'system-1',
      exploreTeaOptions,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    const result = await System.findOneAndUpdate(
      {
        systemId: 'system-1',
      },
      {
        $set: {
          exploreTeaOptions,
        },
      },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateFilter = async payload => {
  const { filters } = payload;

  const existing = await System.findOne({
    systemId: 'system-1',
  });

  if (!existing) {
    const result = await System.create({
      systemId: 'system-1',
      filters,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    const result = await System.findOneAndUpdate(
      {
        systemId: 'system-1',
      },
      {
        $set: {
          filters,
        },
      },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateFAQ = async payload => {
  const existing = await System.findOne({
    systemId: 'system-1',
  });

  if (!existing) {
    const result = await System.create({
      systemId: 'system-1',
      faqs: payload,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    const result = await System.findOneAndUpdate(
      {
        systemId: 'system-1',
      },
      {
        $set: {
          faqs: payload,
        },
      },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateDeliveryPolicy = async payload => {
  const system = await System.findOne({ systemId: 'system-1' });

  if (!system) {
    system = await System.create({
      systemId: 'system-1',
      deliveryPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create system settings',
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { deliveryPolicy: payload },
      { new: true },
    );

    return updatedSystem;
  }
};

const updateSubscriptionPolicy = async payload => {
  const system = await System.findOne({ systemId: 'system-1' });

  if (!system) {
    system = await System.create({
      systemId: 'system-1',
      subscriptionPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create system settings',
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { subscriptionPolicy: payload },
      { new: true },
    );

    return updatedSystem;
  }
};

const updateReturnAndRefundPolicy = async payload => {
  const system = await System.findOne({ systemId: 'system-1' });

  if (!system) {
    system = await System.create({
      systemId: 'system-1',
      returnAndRefund: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create system settings',
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { returnAndRefund: payload },
      { new: true },
    );

    return updatedSystem;
  }
};

const updateCookiesPolicy = async payload => {
  const system = await System.findOne({ systemId: 'system-1' });

  if (!system) {
    system = await System.create({
      systemId: 'system-1',
      cookiesPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create system settings',
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { cookiesPolicy: payload },
      { new: true },
    );

    return updatedSystem;
  }
};

const updateTermsAndConditions = async payload => {
  const system = await System.findOne({ systemId: 'system-1' });

  if (!system) {
    system = await System.create({
      systemId: 'system-1',
      termsAndConditions: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create system settings',
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { termsAndConditions: payload },
      { new: true },
    );

    return updatedSystem;
  }
};

const updatePrivacyPolicy = async payload => {
  const system = await System.findOne({ systemId: 'system-1' });

  if (!system) {
    system = await System.create({
      systemId: 'system-1',
      privacyPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create system settings',
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { privacyPolicy: payload },
      { new: true },
    );

    return updatedSystem;
  }
};

const updateCompanyService = async payload => {
  const existing = await System.findOne({ systemId: 'system-1' });

  if (!existing) {
    // Create a new document if none exists
    const result = await System.create({
      systemId: 'system-1',
      companyService: payload,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    // Update the existing document
    const result = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { $set: { companyService: payload } },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateWhyChooseUs = async payload => {
  const existing = await System.findOne({ systemId: 'system-1' });

  if (!existing) {
    const result = await System.create({
      systemId: 'system-1',
      whyChooseUs: payload,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    const result = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { $set: { whyChooseUs: payload } },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateSecondaryLogo = async payload => {
  const { url } = payload;

  const existing = await System.findOne({
    systemId: 'system-1',
  });

  if (!existing) {
    const result = await System.create({
      systemId: 'system-1',
      secondaryLogo: url,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    const result = await System.findOneAndUpdate(
      {
        systemId: 'system-1',
      },
      {
        $set: { secondaryLogo: url },
      },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateNotification = async payload => {
  const existing = await System.findOne({ systemId: 'system-1' });

  if (!existing) {
    // If no existing document, create a new one
    const result = await System.create({
      systemId: 'system-1',
      topNotifications: payload,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return result;
  } else {
    // Update the document with the new notifications
    const result = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { $set: { topNotifications: payload } },
      { new: true },
    );

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return result;
  }
};

const updateFeaturedSectionSetting = async payload => {
  const existing = await System.findOne({ systemId: 'system-1' });

  if (!existing) {
    // If no existing document, create a new one
    const result = await System.create({
      systemId: 'system-1',
      featured: {
        title: payload.title,
        subTitle: payload.subTitle,
        buttonText: payload.buttonText,
        buttonUrl: payload.buttonUrl,
        bannerImage: payload.bannerImage,
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return result;
  } else {
    // Update the featured section
    const result = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      {
        $set: {
          featured: {
            title: payload.title,
            subTitle: payload.subTitle,
            buttonText: payload.buttonText,
            buttonUrl: payload.buttonUrl,
            bannerImage: payload.bannerImage,
          },
        },
      },
      { new: true },
    );

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return result;
  }
};

const updateLogo = async payload => {
  const { url } = payload;

  const existing = await System.findOne({
    systemId: 'system-1',
  });

  if (!existing) {
    const result = await System.create({
      systemId: 'system-1',
      logo: url,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  } else {
    const result = await System.findOneAndUpdate(
      {
        systemId: 'system-1',
      },
      {
        $set: { logo: url },
      },
      { new: true },
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');

    return result;
  }
};

const updateOfferSetting = async payload => {
  const existing = await System.findOne({ systemId: 'system-1' });

  if (!existing) {
    // Create a new document if none exists
    const result = await System.create({
      systemId: 'system-1',
      offer: payload,
    });

    if (!result) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create offer settings',
      );
    }

    return result;
  } else {
    // Update existing document
    const result = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { $set: { offer: payload } },
      { new: true },
    );

    if (!result) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to update offer settings',
      );
    }

    return result;
  }
};

const updateHeroSetting = async payload => {
  const existing = await System.findOne({ systemId: 'system-1' });

  const updatedHeroSlides = payload.map(item => ({
    ...item,
    bannerImagePath: item.thumbnail,
  }));

  if (!existing) {
    // If no existing document, create a new one
    const result = await System.create({
      systemId: 'system-1',
      hero: updatedHeroSlides,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return result;
  } else {
    // Update the document with the new hero slides
    const result = await System.findOneAndUpdate(
      { systemId: 'system-1' },
      { $set: { hero: updatedHeroSlides } },
      { new: true },
    );

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong!');
    }

    return result;
  }
};

const getSystemConfiguration = async () => {
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
      $lookup: {
        from: 'assortments',
        localField: 'exploreTeaOptions',
        foreignField: '_id',
        as: 'exploreTeaOptions',
      },
    },
    {
      $group: {
        _id: '$_id',
        systemId: { $first: '$systemId' },
        filters: { $first: '$filters' },
        faqs: { $first: '$faqs' },
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
        offer: { $first: '$offer' },
        featured: { $first: '$featured' },
        topNotifications: { $first: '$topNotifications' },
        privacyPolicy: { $first: '$privacyPolicy' },
        termsAndConditions: { $first: '$termsAndConditions' },
        cookiesPolicy: { $first: '$cookiesPolicy' },
        returnAndRefund: { $first: '$returnAndRefund' },
        subscriptionPolicy: { $first: '$subscriptionPolicy' },
        deliveryPolicy: { $first: '$deliveryPolicy' },
        logo: { $first: '$logo' },
        secondaryLogo: { $first: '$secondaryLogo' },
        exploreTeaOptions: { $first: '$exploreTeaOptions' },
      },
    },
  ];

  const result = await System.aggregate(pipeline);

  // console.log(result[0]);

  return result[0];
};

export const SystemService = {
  updateExploreTeaOptions,
  updateFilter,
  updateFAQ,
  updateDeliveryPolicy,
  updateSubscriptionPolicy,
  updateReturnAndRefundPolicy,
  updateCookiesPolicy,
  updateTermsAndConditions,
  updatePrivacyPolicy,
  updateCompanyService,
  updateWhyChooseUs,
  updateSecondaryLogo,
  updateNotification,
  updateFeaturedSectionSetting,
  updateLogo,
  updateOfferSetting,
  updateHeroSetting,
  getSystemConfiguration,
};
