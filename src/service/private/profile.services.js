import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import User from '../../model/user.model.js';

const editPassword = async (payload, userId) => {
  const { currentPassword, newPassword } = payload;

  const user = await User.findOne({ userId });

  if (!user.password || !(await user.matchPassword(currentPassword))) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'password does not match!',
    );
  }

  const result = await User.findOneAndUpdate(
    { userId },
    {
      password: await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds),
      ),
    },
    { new: true },
  );

  result.password = undefined;

  return result;
};

// const editProfile = async (payload, userId) => {
//   const result = await User.findOneAndUpdate(
//     { userId },
//     { $set: { ...payload } },
//     { new: true, upsert: true },
//   );

//   result.password = undefined;

//   return result;
// };

export const ProfileService = {
  editPassword,
  // editProfile,
};
