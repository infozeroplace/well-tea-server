import httpStatus from "http-status";
import { ProductService } from "../../service/public/product.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const getProductList = catchAsync(async (req, res) => {
  const { ...queries } = req.query;

  const { meta, data } = await ProductService.getProductList(queries);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products retrieved successfully",
    meta,
    data,
  });
});

export const ProductController = {
  getProductList,
};
