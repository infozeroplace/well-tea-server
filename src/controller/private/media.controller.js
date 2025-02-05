import httpStatus from "http-status";
import { mediaFilterableField } from "../../constant/media.constant.js";
import { paginationFields } from "../../constant/pagination.constant.js";
import { MediaService } from "../../service/private/media.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";

const getVPSResource = catchAsync(async (req, res) => {
  const result = await MediaService.getVPSResource();

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Details retrieved successfully",
    meta: null,
    data: result,
  });
});

const deleteMediaImages = catchAsync(async (req, res) => {
  const result = await MediaService.deleteMediaImages(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully!",
    meta: null,
    data: result,
  });
});

const deleteMediaImage = catchAsync(async (req, res) => {
  const result = await MediaService.deleteMediaImage(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Deleted successfully!",
    meta: null,
    data: result,
  });
});

const updateMediaImage = catchAsync(async (req, res) => {
  const result = await MediaService.updateMediaImage(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Uploaded successfully!",
    meta: null,
    data: result,
  });
});

const getImageList = catchAsync(async (req, res) => {
  const filters = pick(req.query, mediaFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await MediaService.getImageList(
    filters,
    paginationOptions
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Images retrieved successfully",
    meta,
    data,
  });
});

const downloadImage = catchAsync(async (req, res) => {
  const { filename } = req.params;
  const result = await MediaService.downloadImage(filename);

  return res.download(result, filename, (err) => {
    if (err) {
      res.status(500).json({ message: "File not found or error downloading" });
    }
  });
});

const multipleImageUpload = catchAsync(async (req, res) => {
  const result = await MediaService.multipleImageUpload(req.formattedFiles);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Uploaded successfully!",
    meta: null,
    data: result,
  });
});

export const MediaController = {
  getVPSResource,
  deleteMediaImages,
  deleteMediaImage,
  updateMediaImage,
  getImageList,
  downloadImage,
  multipleImageUpload,
};
