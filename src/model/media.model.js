import { model, Schema } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";
import { filetypes, medias } from "../constant/media.constant.js";

const MediaSchema = Schema(
  {
    originalname: {
      type: String,
      trim: true,
      required: [true, "original is required"],
    },
    filename: {
      type: String,
      trim: true,
      required: [true, "filename is required"],
    },
    filetype: {
      type: String,
      trim: true,
      enum: {
        values: [...filetypes],
        message: "{VALUE} is not matched",
      },
      required: [true, "filetype is required"],
    },
    filesize: {
      type: Number,
      required: [true, "filesize is required"],
    },
    filepath: {
      type: String,
      trim: true,
      required: [true, "filepath is required"],
    },
    media: {
      type: String,
      trim: true,
      enum: {
        values: [...medias],
        message: "{VALUE} is not matched",
      },
      required: [true, "media is required"],
    },
    dimensions: {
      type: String,
      trim: true,
      default: "",
    },
    alternateText: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

MediaSchema.plugin(mongoosePlugin);

const Media = model("Media", MediaSchema);

export default Media;
