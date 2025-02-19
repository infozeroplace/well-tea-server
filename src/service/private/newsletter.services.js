import axios from 'axios';
// import httpStatus from 'http-status';
import config from '../../config/index.js';
// import ApiError from '../../error/ApiError.js';
import { newsletterSearchableFields } from '../../constant/newsletter.constant.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';

const prefix = config.mailchimp_server_prefix;
const audienceId = config.mailchimp_audience_id;
const apikey = config.mailchimp_api_key;

const headers = {
  Authorization: `apikey ${apikey}`,
};

const sendBulkEmail = async emails => {
  try {
    const {
      data: { id: segmentId },
    } = await axios.post(
      `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}/segments`,
      {
        name: 'Selected Contacts Segment',
        options: {
          match: 'any',
          conditions: emails.map(email => ({
            field: "merge_fields.EMAIL",
            condition_type: 'Equals',
            value: email,
          })),
        },
      },
      { headers },
    );
  } catch (error) {
    console.log(error);
  }

  const {
    data: { id: campaignId },
  } = await axios.post(
    `https://${prefix}.api.mailchimp.com/3.0/campaigns`,
    {
      type: 'regular',
      recipients: {
        list_id: audienceId,
        segment_opts: { saved_segment_id: segmentId },
      },
      settings: {
        subject_line: '📢 Special Offer for You!',
        title: '📢 Special Offer for You!',
        from_name: 'WellTea',
        reply_to: 'rumanislam0429@gmail.com',
      },
    },
    { headers },
  );

  const contentData = {
    html: `<h1>Hello!</h1><p>We have a special offer for you.</p>`,
  };

  await axios.put(
    `https://${prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
    contentData,
    { headers },
  );

  await axios.post(
    `https://${prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
    {},
    { headers },
  );
};

const getSubscribedUsers = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const params = {
    offset: (page - 1) * limit,
    count: limit,
  };

  const memberUrl = `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}/members?status=subscribed`;

  const listUrl = `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}`;

  const response = await axios.get(memberUrl, {
    headers,
    params,
  });

  const listResponse = await axios.get(listUrl, { headers });

  const contacts = response.data.members.map(member => ({
    email: member.email_address,
    status: member.status,
    firstName: member.merge_fields.FNAME || '',
    lastName: member.merge_fields.LNAME || '',
  }));

  let filteredContacts = contacts;

  if (searchTerm) {
    const normalizedSearchTerms = searchTerm.trim().toLowerCase().split(' ');

    filteredContacts = filteredContacts.filter(contact =>
      newsletterSearchableFields.some(field => {
        if (contact[field]) {
          const normalizedField = contact[field].trim().toLowerCase();
          return normalizedSearchTerms.every(term =>
            normalizedField.includes(term),
          );
        }
        return false;
      }),
    );
  }

  return {
    meta: {
      page,
      limit,
      totalDocs: listResponse.data.stats.member_count,
    },
    data: filteredContacts,
  };
};

export const NewsletterService = {
  sendBulkEmail,
  getSubscribedUsers,
};

// ........................................................................
// const campaignData = {
//     type: 'regular',
//     recipients: { list_id: config.mailchimp_audience_id },
//     settings: {
//       subject_line: '🔥 Exclusive Offer: Your Order Details & More!',
//       title: '🔥 Exclusive Offer: Your Order Details & More!',
//       from_name: 'Well Tea',
//       reply_to: 'rumanislam0429@gmail.com',
//     },
//   };
//   try {
//     // Step 1: Create a campaign
//     const campaignResponse = await axios.post(
//       `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/campaigns`,
//       campaignData,
//       { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } },
//     );
//     const campaignId = campaignResponse.data.id;
//     console.log('✅ Campaign Created:', campaignId);
//     // Step 2: Add email content
//     const contentData = {
//       html: `<div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px;">
//     <div style="background: #ffffff; padding: 20px; 600px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//       <h2 style="color: #4CAF50;">🎉 Welcome to WellTea – Your Perfect Cup Awaits!</h2>
//       <p style="font-size: 16px; color: #333;">Hello Tea Lover,</p>
//       <p style="font-size: 16px; color: #555;">We’re thrilled to have you join the WellTea family! To celebrate, we’re giving you an exclusive <strong>25% OFF</strong> your first order. ☕✨</p>
//       <div style="background: #f3f3f3; padding: 15px; border-radius: 5px; margin: 15px 0;">
//         <p style="margin: 5px 0;">🌿 <strong>Premium Teas</strong>, Handpicked for You</p>
//         <p style="margin: 5px 0;">🛍️ <strong>25% Off</strong> Your First Purchase</p>
//         <p style="margin: 5px 0;">🚚 <strong>Fast & Fresh</strong> Delivery to Your Door</p>
//       </div>
//       <p style="font-size: 18px; font-weight: bold; color: #d35400;">Use Code: <span style="background: #ffeb3b; padding: 5px 10px; border-radius: 5px;">WELCOME25</span> at checkout and start your tea journey today!</p>
//       <a href="https://welltea.zeroplace.co"
//         style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 18px; margin-top: 10px;">
//         🛒 Shop Now & Save 25%
//       </a>
//       <p style="font-size: 14px; color: #888; margin-top: 15px;">Hurry! This offer won’t last forever.</p>
//       <br/>
//       <p style="font-size: 16px; color: #333;"><em>Sip, Relax & Enjoy,</em></p>
//       <p style="font-size: 16px; font-weight: bold; color: #333;">The WellTea Team</p>
//       <br/>
//       <p style="font-size: 12px; color: #888;">P.S. Need recommendations? Our tea experts are here to help! 💌 <a href="mailto:support@welltea.com" style="color: #888;">Reply to this email anytime.</a></p>
//     </div>
//   </div>`,
//     };
//     await axios.put(
//       `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
//       contentData,
//       { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } },
//     );
//     console.log('✅ Content Added to Campaign');
//     // Step 3: Send the campaign
//     await axios.post(
//       `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
//       {},
//       { headers: { Authorization: `apikey ${config.mailchimp_api_key}` } },
//     );
//     console.log('🚀 Campaign Sent Successfully!');
//   } catch (error) {
//     console.log(error);
//   }
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

//   await sendPromotionalEmail();
