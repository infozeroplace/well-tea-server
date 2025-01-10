import { model, Schema } from "mongoose";

const SystemSchema = Schema(
  {
    systemId: {
      type: String,
      default: "system-1",
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
