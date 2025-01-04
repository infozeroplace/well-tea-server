import httpStatus from "http-status";
import { ProductService } from "../../service/private/product.services.js";
import catchAsync from "../../shared/catchAsync.js";
import sendResponse from "../../shared/sendResponse.js";

const addProductTea = catchAsync(async (req, res) => {
  const { ...data } = req.body;

  const result = await ProductService.addProductTea(data);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added successfully!",
    meta: null,
    data: result,
  });
});

export const ProductController = {
  addProductTea,
};
