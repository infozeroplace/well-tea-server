import axios from 'axios';
import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';
import { dateFormatter } from '../../helper/dateFormatter.js';
import { jwtHelpers } from '../../helper/jwtHelpers.js';
import User from '../../model/user.model.js';
import {
  sendAdminForgotPasswordLink,
  sendForgotPasswordLink,
} from '../../shared/nodeMailer.js';
import { generateUserId } from '../../utils/generateUserId.js';

const oAuth2Client = new OAuth2Client(
  config.google_client_id,
  config.google_client_secret,
  'postmessage',
);

const registerForNewsletter = async payload => {
  const { email, firstName, lastName } = payload;

  try {
    const data = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      },
    };

    const jsonData = JSON.stringify(data);

    await axios.post(
      `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/lists/${config.mailchimp_audience_id}/members`,
      jsonData,
      {
        headers: {
          Authorization: `apikey ${config.mailchimp_api_key}`,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
};

const resetPassword = async payload => {
  const { token, password } = payload;

  const isTokenExists = await User.findOne({ resetToken: token });

  if (!isTokenExists) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token');
  }

  let verifiedUser = null;

  try {
    verifiedUser = jwtHelpers.verifiedToken(token, config?.jwt?.secret);
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Token expired!');
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: verifiedUser.email },
    {
      resetToken: '',
      password: await bcrypt.hash(password, Number(config.bcrypt_salt_rounds)),
    },
    { new: true },
  );

  // Create access token
  const accessToken = jwtHelpers.createToken(
    {
      role: updatedUser?.role,
      userId: updatedUser?.userId,
      email: updatedUser?.email,
      blockStatus: updatedUser?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.expires_in,
  );

  // Create refresh token
  const refreshToken = jwtHelpers.createToken(
    {
      role: updatedUser?.role,
      userId: updatedUser?.userId,
      email: updatedUser?.email,
      blockStatus: updatedUser?.blockStatus,
    },
    config?.jwt?.refresh_secret,
    config?.jwt?.refresh_expires_in,
  );

  updatedUser.isPasswordHas = updatedUser.password ? true : false;

  // Remove the password
  updatedUser.password = undefined;

  return {
    accessToken,
    refreshToken,
    user: updatedUser,
  };
};

const forgotPassword = async payload => {
  const { email } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'We cannot find your email.');
  }

  // Create access token
  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.email_expires_in,
  );

  const updatedUser = await User.findOneAndUpdate(
    { email },
    { resetToken: accessToken },
    { new: true },
  );

  const name = `${updatedUser.firstName} ${updatedUser.lastName}`;

  if (updatedUser.resetToken) {
    if (updatedUser.role !== 'super_admin') {
      await sendForgotPasswordLink(email, name, accessToken);
    } else {
      await sendAdminForgotPasswordLink(email, name, accessToken);
    }
  } else {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

const register = async payload => {
  const isEmailExist = await User.findOne({ email: payload.email });

  if (isEmailExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists!!');
  }

  const createdUser = await User.create({
    userId: await generateUserId(),
    ...payload,
  });

  const { UTC, dateString } = dateFormatter.getDates();

  // Create access token
  const accessToken = jwtHelpers.createToken(
    {
      role: createdUser?.role,
      userId: createdUser?.userId,
      email: createdUser?.email,
      blockStatus: createdUser?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.expires_in,
  );

  // Create refresh token
  const refreshToken = jwtHelpers.createToken(
    {
      role: createdUser?.role,
      userId: createdUser?.userId,
      email: createdUser?.email,
      blockStatus: createdUser?.blockStatus,
    },
    config?.jwt?.refresh_secret,
    config?.jwt?.refresh_expires_in,
  );

  const updatedUser = await User.findOneAndUpdate(
    { email: createdUser?.email },
    { new: true },
  );

  createdUser.isPasswordHas = createdUser.password ? true : false;

  // Remove the password
  createdUser.password = undefined;

  if (payload.newsletter) {
    await registerForNewsletter({
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
    });
  }

  return {
    accessToken,
    refreshToken,
    user: createdUser,
  };
};

const login = async payload => {
  const { email, password } = payload;
  const isUserExistWithoutLean = await User.findOne({ email });
  const isUserExist = await User.findOne({ email }).lean();

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  if (
    !isUserExistWithoutLean.password ||
    !(await isUserExistWithoutLean.matchPassword(password))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID or password!');
  }

  if (
    isUserExist.role === 'moderator' ||
    isUserExist.role === 'admin' ||
    isUserExist.role === 'super_admin'
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Moderators cannot login!');
  }

  // Create access token
  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.expires_in,
  );

  // Create refresh token
  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.refresh_secret,
    config?.jwt?.refresh_expires_in,
  );

  isUserExist.isPasswordHas = isUserExist.password ? true : false;

  // Remove the password
  isUserExist.password = undefined;

  return {
    accessToken,
    refreshToken,
    user: isUserExist,
  };
};

const adminLogin = async payload => {
  const { email, password } = payload;
  console.log(payload)

  const isUserExist = await User.findOne({ email });
  console.log(isUserExist)

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  if (isUserExist.role !== 'super_admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Id or password!');
  }
  console.log(isUserExist.password)

  if (!isUserExist.password || !(await isUserExist.matchPassword(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ID or password!');
  }

  // Create access token
  const accessToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.expires_in,
  );

  // Create refresh token
  const refreshToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.refresh_secret,
    config?.jwt?.refresh_expires_in,
  );

  // Remove the password
  isUserExist.password = undefined;

  return {
    accessToken,
    refreshToken,
    user: isUserExist,
  };
};

const googleLogin = async code => {
  // Finding jwt token here from google
  const {
    tokens: {
      access_token,
      refresh_token,
      scope,
      token_type,
      id_token,
      expiry_date,
    },
  } = await oAuth2Client.getToken(code);

  // Collecting the user data from google
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: id_token,
    audience: config.google_client_id,
  });
  // ....................................

  const { payload } = ticket;
  const { given_name, family_name, email, email_verified } = payload;

  // Google authenticating that user is verified or not
  if (!email_verified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is not verified');
  }

  // Checking that is the user already exits or not in the database
  const isUserExists = await User.findOne({ email: email }).lean();

  if (isUserExists && isUserExists.role === 'super_admin') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Moderators cannot login!');
  }

  if (isUserExists) {
    // Create access token
    const accessToken = jwtHelpers.createToken(
      {
        role: isUserExists?.role,
        userId: isUserExists?.userId,
        email: isUserExists?.email,
        blockStatus: isUserExists?.blockStatus,
      },
      config?.jwt?.secret,
      config?.jwt?.expires_in,
    );

    // Create refresh token
    const refreshToken = jwtHelpers.createToken(
      {
        role: isUserExists?.role,
        userId: isUserExists?.userId,
        email: isUserExists?.email,
        blockStatus: isUserExists?.blockStatus,
      },
      config?.jwt?.refresh_secret,
      config?.jwt?.refresh_expires_in,
    );

    isUserExists.isPasswordHas = isUserExists.password ? true : false;

    // Remove the password
    isUserExists.password = undefined;

    return {
      accessToken,
      refreshToken,
      user: isUserExists,
    };
  } else {
    const createdUser = await User.create({
      userId: await generateUserId(),
      email: email,
      firstName: given_name || '.',
      lastName: family_name || '.',
      isSocialLogin: true,
    });

    const { UTC, dateString } = dateFormatter.getDates();

    const admin = await User.findOne({ role: config.super_admin_role });

    // Create access token
    const accessToken = jwtHelpers.createToken(
      {
        role: createdUser?.role,
        userId: createdUser?.userId,
        email: createdUser?.email,
        blockStatus: createdUser?.blockStatus,
      },
      config?.jwt?.secret,
      config?.jwt?.expires_in,
    );

    // Create refresh token
    const refreshToken = jwtHelpers.createToken(
      {
        role: createdUser?.role,
        userId: createdUser?.userId,
        email: createdUser?.email,
        blockStatus: createdUser?.blockStatus,
      },
      config?.jwt?.refresh_secret,
      config?.jwt?.refresh_expires_in,
    );

    createdUser.isPasswordHas = createdUser.password ? true : false;

    await registerForNewsletter({
      email: email,
      firstName: given_name,
      lastName: family_name,
    });

    return {
      accessToken,
      refreshToken,
      user: createdUser,
    };
  }
};

const adminRefreshToken = async (refreshToken, res) => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifiedToken(
      refreshToken,
      config?.jwt?.refresh_secret,
    );
  } catch (err) {
    res.clearCookie('auth', {
      domain: config.cookie_domain,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { userId } = verifiedToken;
  // If the user already deleted then delete the refresh token
  const isUserExist = await User.findOne({ userId: userId }).lean();

  if (!isUserExist) {
    res.clearCookie('auth', {
      domain: config.cookie_domain,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.expires_in,
  );

  isUserExist.isPasswordHas = isUserExist.password ? true : false;

  // Remove the password
  isUserExist.password = undefined;

  return {
    accessToken: newAccessToken,
    user: isUserExist,
  };
};

const refreshToken = async (refreshToken, res) => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifiedToken(
      refreshToken,
      config?.jwt?.refresh_secret,
    );
  } catch (err) {
    res.clearCookie('auth_refresh', {
      domain: config.cookie_domain,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token');
  }

  const { userId } = verifiedToken;
  // If the user already deleted then delete the refresh token
  const isUserExist = await User.findOne({ userId: userId }).lean();

  if (!isUserExist) {
    res.clearCookie('auth_refresh', {
      domain: config.cookie_domain,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');
  }

  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      role: isUserExist?.role,
      userId: isUserExist?.userId,
      email: isUserExist?.email,
      blockStatus: isUserExist?.blockStatus,
    },
    config?.jwt?.secret,
    config?.jwt?.expires_in,
  );

  isUserExist.isPasswordHas = isUserExist.password ? true : false;

  // Remove the password
  isUserExist.password = undefined;

  return {
    accessToken: newAccessToken,
    user: isUserExist,
  };
};

export const AuthService = {
  resetPassword,
  forgotPassword,
  register,
  login,
  adminLogin,
  googleLogin,
  adminRefreshToken,
  refreshToken,
};
