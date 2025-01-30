import { model, Schema } from "mongoose";

const SystemSchema = Schema(
  {
    systemId: {
      type: String,
      default: "system-1",
    },
    logo: String,
    secondaryLogo: String,
    faqs: {
      type: [
        {
          title: String,
          faqs: [{ question: String, answer: String }],
        },
      ],
    },
    hero: {
      type: [
        {
          bannerImagePath: String,
          bannerImageTitle: String,
          bannerImageDescription: String,
          bannerImageButtonText: String,
          bannerImageButtonUrl: String,
        },
      ],
    },
    whyChooseUs: {
      type: [
        {
          title: String,
          description: String,
          iconPath: String,
          imagePath: String,
        },
      ],
    },
    companyService: {
      type: [
        {
          title: String,
          description: String,
          iconPath: String,
        },
      ],
    },
    offer: {
      allOffer: {
        title: String,
        thumbnail: {
          path: String,
        },
      },
      teaOffer: {
        title: String,
        thumbnail: {
          path: String,
        },
      },
      teawareOffer: {
        title: String,
        thumbnail: {
          path: String,
        },
      },
      giftOffer: {
        title: String,
        thumbnail: {
          path: String,
        },
      },
    },
    featured: {
      title: String,
      subTitle: String,
      buttonText: String,
      buttonUrl: String,
      bannerImage: String,
    },
    topNotifications: [String],
    privacyPolicy: String,
    termsAndConditions: String,
    cookiesPolicy: String,
    returnAndRefund: String,
    subscriptionPolicy: String,
    deliveryPolicy: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const System = model("System", SystemSchema);

export { System };
