import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../config/index.js';
import ApiError from '../../error/ApiError.js';

const test = async () => {
  // ........................................................................
  // const campaignData = {
  //   type: 'regular',
  //   recipients: { list_id: config.mailchimp_audience_id },
  //   settings: {
  //     subject_line: 'Offer 25%',
  //     title: 'Black Friday',
  //     from_name: 'Well Tea',
  //     reply_to: 'rumanislam0429@gmail.com',
  //   },
  // };
  // try {
  //   // Step 1: Create a campaign
  //   const campaignResponse = await axios.post(
  //     `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/campaigns`,
  //     campaignData,
  //     { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } },
  //   );
  //   const campaignId = campaignResponse.data.id;
  //   console.log('✅ Campaign Created:', campaignId);
  //   // Step 2: Add email content
  //   const contentData = {
  //     html: "<h1>🔥 Black Friday Offer - 25% Off! 🔥</h1><p>Don't miss out on our biggest sale of the year!</p>",
  //   };
  //   await axios.put(
  //     `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
  //     contentData,
  //     { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } },
  //   );
  //   console.log('✅ Content Added to Campaign');
  //   // Step 3: Send the campaign
  //   await axios.post(
  //     `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
  //     {},
  //     { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } },
  //   );
  //   console.log('🚀 Campaign Sent Successfully!');
  // } catch (error) {
  //   console.log(error);
  // }
  // ........................................................................
  // ........................................................................
  // const response = await axios.get(
  //   `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/reports/97cd294801`,
  //   { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } }
  // );
  // console.log("📊 Emails Sent:", response.data.emails_sent);
  // console.log("📩 Open Rate:", response.data.opens.rate);
  // console.log("🔗 Click Rate:", response.data.clicks.rate);
  // ........................................................................
};

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
      throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
    }
  } catch (error) {
    if (error.response) {
      throw new ApiError(
        error.response.status,
        error.response.data.detail || 'Mailchimp API Error',
      );
    } else if (error.request) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No response from Mailchimp');
    } else {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
};

export const NewsletterService = {
  test,
  subscribe,
};
