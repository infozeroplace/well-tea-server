import httpStatus from "http-status";
import { productTeaFilterableField } from "../../constant/product.constant.js";
import { ProductService } from "../../service/public/product.services.js";
import catchAsync from "../../shared/catchAsync.js";
import pick from "../../shared/pick.js";
import sendResponse from "../../shared/sendResponse.js";
import { paginationFields } from "../../constant/pagination.constant.js";

const getProductList = catchAsync(async (req, res) => {
  const filters = pick(req.query, productTeaFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await ProductService.getProductList(
    filters,
    paginationOptions
  );

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
