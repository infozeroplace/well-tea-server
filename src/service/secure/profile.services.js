import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config/index.js";
import ApiError from "../../error/ApiError.js";
import User from "../../model/user.model.js";

const editPasswordForSocialUser = async (payload, userId) => {
  const { newPassword } = payload;

  const result = await User.findOneAndUpdate(
    { userId },
    {
      password: await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds)
      ),
    },
    { new: true }
  );

  result.isPasswordHas = result.password ? true : false;

  result.password = undefined;

  return result;
};

const editPassword = async (payload, userId) => {
  const { currentPassword, newPassword } = payload;

  const user = await User.findOne({ userId });

  if (!user.password || !(await user.matchPassword(currentPassword))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Current password does not match!"
    );
  }

  const result = await User.findOneAndUpdate(
    { userId },
    {
      password: await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds)
      ),
    },
    { new: true }
  );

  result.isPasswordHas = result.password ? true : false;

  result.password = undefined;

  return result;
};

export const ProfileService = {
  editPasswordForSocialUser,
  editPassword,
};
