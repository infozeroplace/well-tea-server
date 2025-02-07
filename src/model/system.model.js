import { model, Schema } from "mongoose";

const SystemSchema = Schema(
  {
    systemId: {
      type: String,
      default: "system-1",
    },
    logo: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    secondaryLogo: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    filters: {
      type: [
        {
          title: String,
          category: String,
          key: String,
          selectedKey: String,
          options: [{ param: String }],
        },
      ],
    },
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
          bannerImagePath: {
            type: Schema.Types.ObjectId,
            ref: "Media",
          },
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
          iconPath: {
            type: Schema.Types.ObjectId,
            ref: "Media",
          },
          imagePath: {
            type: Schema.Types.ObjectId,
            ref: "Media",
          },
        },
      ],
    },
    companyService: {
      type: [
        {
          title: String,
          description: String,
          iconPath: {
            type: Schema.Types.ObjectId,
            ref: "Media",
          },
        },
      ],
    },
    offer: {
      offerOne: {
        title: String,
        subTitle: String,
        category: String,
        thumbnail: {
          type: Schema.Types.ObjectId,
          ref: "Media",
        },
      },
      offerTwo: {
        title: String,
        subTitle: String,
        category: String,
        thumbnail: {
          type: Schema.Types.ObjectId,
          ref: "Media",
        },
      },
      offerThree: {
        title: String,
        subTitle: String,
        category: String,
        thumbnail: {
          type: Schema.Types.ObjectId,
          ref: "Media",
        },
      },
      offerFour: {
        title: String,
        subTitle: String,
        category: String,
        thumbnail: {
          type: Schema.Types.ObjectId,
          ref: "Media",
        },
      },
    },
    featured: {
      title: String,
      subTitle: String,
      buttonText: String,
      buttonUrl: String,
      bannerImage: {
        type: Schema.Types.ObjectId,
        ref: "Media",
      },
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
