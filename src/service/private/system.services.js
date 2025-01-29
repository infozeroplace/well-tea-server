import httpStatus from "http-status";
import ApiError from "../../error/ApiError.js";
import { System } from "../../model/system.model.js";
import { removeImage } from "../../utils/fileSystem.js";

const updateDeliveryPolicy = async (payload) => {
  const system = await System.findOne({ systemId: "system-1" });

  if (!system) {
    system = await System.create({
      systemId: "system-1",
      deliveryPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create system settings"
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { deliveryPolicy: payload },
      { new: true }
    );

    return updatedSystem;
  }
};

const updateSubscriptionPolicy = async (payload) => {
  const system = await System.findOne({ systemId: "system-1" });

  if (!system) {
    system = await System.create({
      systemId: "system-1",
      subscriptionPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create system settings"
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { subscriptionPolicy: payload },
      { new: true }
    );

    return updatedSystem;
  }
};

const updateReturnAndRefundPolicy = async (payload) => {
  const system = await System.findOne({ systemId: "system-1" });

  if (!system) {
    system = await System.create({
      systemId: "system-1",
      returnAndRefund: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create system settings"
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { returnAndRefund: payload },
      { new: true }
    );

    return updatedSystem;
  }
};

const updateCookiesPolicy = async (payload) => {
  const system = await System.findOne({ systemId: "system-1" });

  if (!system) {
    system = await System.create({
      systemId: "system-1",
      cookiesPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create system settings"
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { cookiesPolicy: payload },
      { new: true }
    );

    return updatedSystem;
  }
};

const updateTermsAndConditions = async (payload) => {
  const system = await System.findOne({ systemId: "system-1" });

  if (!system) {
    system = await System.create({
      systemId: "system-1",
      termsAndConditions: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create system settings"
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { termsAndConditions: payload },
      { new: true }
    );

    return updatedSystem;
  }
};

const updatePrivacyPolicy = async (payload) => {
  const system = await System.findOne({ systemId: "system-1" });

  if (!system) {
    system = await System.create({
      systemId: "system-1",
      privacyPolicy: payload,
    });

    if (!system) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create system settings"
      );
    }

    return system;
  } else {
    const updatedSystem = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { privacyPolicy: payload },
      { new: true }
    );

    return updatedSystem;
  }
};

const updateCompanyService = async (payload) => {
  const existing = await System.findOne({ systemId: "system-1" });

  const updatedFields = payload.map((item) => ({
    ...item,
    iconPath: `/public/image/upload/${item.iconPath}`,
  }));

  if (!existing) {
    // Create a new document if none exists
    const result = await System.create({
      systemId: "system-1",
      companyService: updatedFields,
    });
    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    return result;
  } else {
    // Get current icon paths
    const oldIcons = existing.companyService.map((field) => field.iconPath);

    // Get new icon paths
    const newIcons = updatedFields.map((field) => field.iconPath);

    // Determine which icons are no longer used
    const iconsToRemove = oldIcons.filter((path) => !newIcons.includes(path));

    // Update the existing document
    const result = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { $set: { companyService: updatedFields } },
      { new: true }
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

    // Remove unused icons
    for (const iconPath of iconsToRemove) {
      const filename = iconPath.split("/").pop();
      await removeImage(filename); // Assuming `removeImage` deletes the file
    }

    return result;
  }
};

const updateWhyChooseUs = async (payload) => {
  const existing = await System.findOne({ systemId: "system-1" });

  const updatedFields = payload.map((item) => ({
    ...item,
    iconPath: `/public/image/upload/${item.iconPath}`,
    imagePath: `/public/image/upload/${item.imagePath}`,
  }));

  if (!existing) {
    const result = await System.create({
      systemId: "system-1",
      whyChooseUs: updatedFields,
    });
    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    return result;
  } else {
    const oldIcons = existing.whyChooseUs.map((field) => field.iconPath);
    const oldImages = existing.whyChooseUs.map((field) => field.imagePath);

    const newIcons = updatedFields.map((field) => field.iconPath);
    const newImages = updatedFields.map((field) => field.imagePath);

    const iconsToRemove = oldIcons.filter((path) => !newIcons.includes(path));
    const imagesToRemove = oldImages.filter(
      (path) => !newImages.includes(path)
    );

    const result = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { $set: { whyChooseUs: updatedFields } },
      { new: true }
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

    for (const iconPath of iconsToRemove) {
      const filename = iconPath.split("/").pop();
      await removeImage(filename);
    }

    for (const imagePath of imagesToRemove) {
      const filename = imagePath.split("/").pop();
      await removeImage(filename);
    }

    return result;
  }
};

const updateSecondaryLogo = async (payload) => {
  const { url } = payload;

  const existing = await System.findOne({
    systemId: "system-1",
  });

  if (!existing) {
    const result = await System.create({
      systemId: "system-1",
      secondaryLogo: url,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

    return result;
  } else {
    existing.secondaryLogo && (await removeImage(existing.secondaryLogo));

    const result = await System.findOneAndUpdate(
      {
        systemId: "system-1",
      },
      {
        $set: { secondaryLogo: url },
      },
      { new: true }
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

    return result;
  }
};

const updateNotification = async (payload) => {
  const existing = await System.findOne({ systemId: "system-1" });

  if (!existing) {
    // If no existing document, create a new one
    const result = await System.create({
      systemId: "system-1",
      topNotifications: payload,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    }

    return result;
  } else {
    // Update the document with the new notifications
    const result = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { $set: { topNotifications: payload } },
      { new: true }
    );

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    }

    return result;
  }
};

const updateFeaturedSectionSetting = async (payload) => {
  const existing = await System.findOne({ systemId: "system-1" });

  const newImagePath = payload.bannerImage;

  if (!existing) {
    // If no existing document, create a new one
    const result = await System.create({
      systemId: "system-1",
      featured: {
        title: payload.title,
        subTitle: payload.subTitle,
        buttonText: payload.buttonText,
        buttonUrl: payload.buttonUrl,
        bannerImage: newImagePath,
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    }

    return result;
  } else {
    const oldImage = existing.featured?.bannerImage;

    // Remove old image if a new image is uploaded
    if (oldImage && oldImage !== newImagePath) {
      const filename = oldImage.split("/").pop(); // Extract the filename
      await removeImage(filename);
    }

    // Update the featured section
    const result = await System.findOneAndUpdate(
      { systemId: "system-1" },
      {
        $set: {
          featured: {
            title: payload.title,
            subTitle: payload.subTitle,
            buttonText: payload.buttonText,
            buttonUrl: payload.buttonUrl,
            bannerImage: newImagePath,
          },
        },
      },
      { new: true }
    );

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    }

    return result;
  }
};

const updateLogo = async (payload) => {
  const { url } = payload;

  const existing = await System.findOne({
    systemId: "system-1",
  });

  if (!existing) {
    const result = await System.create({
      systemId: "system-1",
      logo: url,
    });

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

    return result;
  } else {
    existing.logo && (await removeImage(existing.logo));

    const result = await System.findOneAndUpdate(
      {
        systemId: "system-1",
      },
      {
        $set: { logo: url },
      },
      { new: true }
    );

    if (!result)
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");

    return result;
  }
};

const updateOfferSetting = async (payload) => {
  const existing = await System.findOne({ systemId: "system-1" });

  // Helper function to handle image updates and removals
  const handleImageUpdate = async (newImagePath, existingImagePath) => {
    if (existingImagePath && newImagePath !== existingImagePath) {
      const oldFilename = existingImagePath.split("/").pop();
      await removeImage(oldFilename); // Remove old image
    }
    return newImagePath;
  };

  const { allOffer, teaOffer, teawareOffer, giftOffer } = payload;

  // Update or initialize the offer object
  const updatedOffer = {
    allOffer: {
      title: allOffer.title,
      thumbnail: {
        path: await handleImageUpdate(
          allOffer.thumbnail.path,
          existing?.offer?.allOffer?.thumbnail?.path
        ),
      },
    },
    teaOffer: {
      title: teaOffer.title,
      thumbnail: {
        path: await handleImageUpdate(
          teaOffer.thumbnail.path,
          existing?.offer?.teaOffer?.thumbnail?.path
        ),
      },
    },
    teawareOffer: {
      title: teawareOffer.title,
      thumbnail: {
        path: await handleImageUpdate(
          teawareOffer.thumbnail.path,
          existing?.offer?.teawareOffer?.thumbnail?.path
        ),
      },
    },
    giftOffer: {
      title: giftOffer.title,
      thumbnail: {
        path: await handleImageUpdate(
          giftOffer.thumbnail.path,
          existing?.offer?.giftOffer?.thumbnail?.path
        ),
      },
    },
  };

  if (!existing) {
    // Create a new document if none exists
    const result = await System.create({
      systemId: "system-1",
      offer: updatedOffer,
    });

    if (!result) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create offer settings"
      );
    }

    return result;
  } else {
    // Update existing document
    const result = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { $set: { offer: updatedOffer } },
      { new: true }
    );

    if (!result) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to update offer settings"
      );
    }

    return result;
  }
};

const updateHeroSetting = async (payload) => {
  const existing = await System.findOne({ systemId: "system-1" });

  const updatedHeroSlides = payload.map((item) => ({
    ...item,
    bannerImagePath: `/public/image/upload/${item.bannerImagePath}`,
  }));

  if (!existing) {
    // If no existing document, create a new one
    const result = await System.create({
      systemId: "system-1",
      hero: updatedHeroSlides,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    }

    return result;
  } else {
    // Identify images to remove
    const oldImages = existing.hero.map((slide) => slide.bannerImagePath);
    const updatedImages = updatedHeroSlides.map(
      (slide) => slide.bannerImagePath
    );

    const imagesToRemove = oldImages.filter(
      (oldImage) => !updatedImages.includes(oldImage)
    );

    // Remove old images that are not in the updated list
    for (const imagePath of imagesToRemove) {
      const filename = imagePath.split("/").pop(); // Extract the filename
      await removeImage(filename);
    }

    // Update the document with the new hero slides
    const result = await System.findOneAndUpdate(
      { systemId: "system-1" },
      { $set: { hero: updatedHeroSlides } },
      { new: true }
    );

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
    }

    return result;
  }
};

const getSystemConfiguration = async (payload) => {
  const result = await System.findOne({ systemId: "system-1" });

  return result;
};

export const SystemService = {
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
