import httpStatus from 'http-status';
import { wishlistFilterableField } from '../../constant/wishlist.constant.js';
import { paginationFields } from '../../constant/pagination.constant.js';
import { WishlistService } from '../../service/private/wishlist.services.js';
import catchAsync from '../../shared/catchAsync.js';
import pick from '../../shared/pick.js';
import sendResponse from '../../shared/sendResponse.js';

const getWishlist = catchAsync(async (req, res) => {
  const filters = pick(req.query, wishlistFilterableField);
  const paginationOptions = pick(req.query, paginationFields);

  const { meta, data } = await WishlistService.getWishlist(
    filters,
    paginationOptions,
  );

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'retrieved successfully',
    meta,
    data,
  });
});

export const WishlistController = {
  getWishlist,
};
