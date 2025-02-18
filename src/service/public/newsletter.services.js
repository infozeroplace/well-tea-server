import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';

const subscribe = async payload => {
  const { email } = payload;

  const data = {
    email_address: email,
    status: 'subscribed',
  };

  const jsonData = JSON.stringify(data);

  try {
    const response = await axios.post(
      `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/lists/${config.mailchimp_audience_id}/members`,
      jsonData,
      {
        headers: {
          Authorization: `apikey ${config.mailchimp_api_key}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      return;
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
    }
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
};

export const NewsletterService = {
  subscribe,
};
