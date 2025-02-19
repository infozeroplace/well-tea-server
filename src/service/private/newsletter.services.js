import axios from 'axios';
// import httpStatus from 'http-status';
import config from '../../config/index.js';
// import ApiError from '../../error/ApiError.js';
import { newsletterSearchableFields } from '../../constant/newsletter.constant.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';

const getSubscribedUsers = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  // Step 1: Create conditions for search term
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: newsletterSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Step 2: Add other filter conditions
  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Step 4: Handle pagination
  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  // Step 5: Sorting options
  const sortConditions = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Step 6: Define Mailchimp API request params (pagination, sorting)
  const params = {
    offset: (page - 1) * limit, // Calculate the offset for pagination
    count: limit, // Set the limit for the number of members to fetch
  };

  // If any filters or sort conditions are needed, add them to the params here
  // Mailchimp API has some limited sorting and filtering options, but we can apply them on our end
  if (searchTerm || filtersData.status) {
    // For simplicity, assume we do the filtering manually
    // We will request the members first and filter them later (as the API does not allow complex filtering directly)
  }

  const response = await axios.get(
    `https://${config.mailchimp_server_prefix}.api.mailchimp.com/3.0/lists/${config.mailchimp_audience_id}/members`,
    {
      headers: {
        Authorization: `apikey ${config.mailchimp_api_key}`,
      },
      params,
    },
  );

  // Step 7: Map over the response data to match the desired format
  const contacts = response.data.members.map(member => ({
    email: member.email_address,
    status: member.status,
    firstName: member.merge_fields.FNAME,
    lastName: member.merge_fields.LNAME,
  }));

  // Step 8: Apply any additional filter/sorting logic (like search term) manually
  const filteredContacts = contacts.filter(contact => {
    let matches = true;

    if (searchTerm) {
      matches = newsletterSearchableFields.some(
        field =>
          contact[field] &&
          contact[field].toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filtersData.status && contact.status !== filtersData.status) {
      matches = false;
    }

    return matches;
  });

  // Step 9: Handle pagination, sorting, and return results
  const sortedContacts = filteredContacts.sort((a, b) => {
    if (sortBy && sortOrder) {
      const fieldA = a[sortBy] ?? null; // Use null for missing fields
      const fieldB = b[sortBy] ?? null;

      if (fieldA === null) return 1; // Push null values to the end
      if (fieldB === null) return -1;

      const compareResult = fieldA.toString().localeCompare(fieldB.toString());
      return sortOrder === 'asc' ? compareResult : -compareResult;
    }
    return 0;
  });

  const paginatedContacts = sortedContacts.slice(
    (page - 1) * limit,
    page * limit,
  );

  return {
    meta: {
      page,
      limit,
      totalDocs: filteredContacts.length,
    },
    data: paginatedContacts,
  };
};

export const NewsletterService = {
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
