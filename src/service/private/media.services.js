import fs from "fs";
import httpStatus from "http-status";
import path from "path";
import { __dirname } from "../../app.js";
import { mediaSearchableFields } from "../../constant/media.constant.js";
import ApiError from "../../error/ApiError.js";
import { PaginationHelpers } from "../../helper/paginationHelper.js";
import Media from "../../model/media.model.js";
import { removeImage } from "../../utils/fileSystem.js";

const getVPSResource = async () => {
  const stats = fs.statfsSync("/");
  const total = stats.blocks * stats.bsize;
  const free = stats.bfree * stats.bsize;
  const used = total - free;

  const freePercentage = ((free / total) * 100).toFixed(0);
  const usedPercentage = ((used / total) * 100).toFixed(0);

  const data = {
    total: (total / 1e9).toFixed(2) + " GB",
    used: (used / 1e9).toFixed(2) + " GB",
    free: (free / 1e9).toFixed(2) + " GB",
    freePercentage: freePercentage,
    usedPercentage: usedPercentage,
  };

  return data;
};

const deleteMediaImages = async (payload) => {
  const { ids } = payload;
  const medias = await Media.find({ _id: { $in: ids } });

  if (!medias.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Medias not found");
  }

  // Delete products
  const result = await Media.deleteMany({ _id: { $in: ids } });

  await Promise.all(medias.map((item) => removeImage(item.filename)));

  return result;
};

const deleteMediaImage = async (payload) => {
  const { id } = payload;

  const existingMedia = await Media.findById(id);

  if (!existingMedia)
    throw new ApiError(httpStatus.BAD_REQUEST, "Media not found!");

  const result = await Media.findByIdAndDelete(id);

  await removeImage(existingMedia.filename);

  return result;
};

const updateMediaImage = async (payload) => {
  const { id, alternateText } = payload;

  const existingMedia = await Media.findById(id);

  if (!existingMedia)
    throw new ApiError(httpStatus.BAD_REQUEST, "Media not found!");

  const result = await Media.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        alternateText,
      },
    }
  );

  return result;
};

const getImageList = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: mediaSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const filterHandlers = {
      filetype: (value) => {
        const filetypes = value.split(",");
        return {
          filetype: {
            $in: filetypes,
          },
        };
      },
      media: (value) => {
        const medias = value.split(",");
        return {
          media: {
            $in: medias,
          },
        };
      },
      default: (field, value) => ({
        [field]: value,
      }),
    };

    if (Object.keys(filtersData).length) {
      andCondition.push({
        $and: Object.entries(filtersData).map(([field, value]) => {
          const handler = filterHandlers[field] || filterHandlers.default;
          return handler(field === "default" ? [field, value] : value);
        }),
      });
    }
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const sortConditions = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const pipelines = [
    {
      $match: whereConditions,
    },
    {
      $sort: sortConditions,
    },
  ];

  const options = {
    page,
    limit,
  };

  const result = await Media.aggregatePaginate(pipelines, options);

  const { docs, totalDocs } = result;

  return {
    meta: {
      page,
      limit,
      totalDocs,
    },
    data: docs,
  };
};

const downloadImage = async (filename) => {
  const filePath = path.join(__dirname, "public", "image/upload", filename);

  return filePath;
};

const multipleImageUpload = async (payload) => {
  const publicFolder = path.join(__dirname, "public", "image/upload");

  if (!fs.existsSync(publicFolder)) {
    fs.mkdirSync(publicFolder, { recursive: true });
  }

  const uploadedImages = [];

  for (const elem of payload) {
    const {
      originalname,
      filename,
      filetype,
      filesize,
      filepath,
      dimensions,
      media,
      alternateText,
    } = elem;

    const newFilePath = path.join(publicFolder, filename);

    try {
      fs.copyFileSync(elem.path, newFilePath);

      // Use fs.unlink asynchronously to avoid locking issues
      fs.unlink(elem.path, (err) => {
        if (err) console.error(`Error deleting file: ${elem.path}`, err);
      });

      uploadedImages.push({
        originalname,
        filename,
        filetype,
        filesize,
        filepath,
        dimensions,
        media,
        alternateText,
      });
    } catch (error) {
      console.error(`Error processing file: ${filename}`, error);
    }
  }

  const result = await Media.insertMany(uploadedImages);

  return result;
};

export const MediaService = {
  getVPSResource,
  deleteMediaImages,
  deleteMediaImage,
  updateMediaImage,
  getImageList,
  downloadImage,
  multipleImageUpload,
};
