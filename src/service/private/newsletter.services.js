import axios from 'axios';
import httpStatus from 'http-status';
import config from '../../config/index.js';
import { newsletterSearchableFields } from '../../constant/newsletter.constant.js';
import ApiError from '../../error/ApiError.js';
import { PaginationHelpers } from '../../helper/paginationHelper.js';

const prefix = config.mailchimp_server_prefix;
const audienceId = config.mailchimp_audience_id;
const apikey = config.mailchimp_api_key;
const mailchimpEmail = config.mailchimp_email;

const headers = {
  Authorization: `apikey ${apikey}`,
};

const sendBulkEmail = async payload => {
  const { subject, fromName, content } = payload;

  try {
    const campaignData = {
      type: 'regular',
      recipients: { list_id: audienceId },
      settings: {
        subject_line: subject,
        title: subject,
        from_name: fromName,
        reply_to: mailchimpEmail,
      },
    };

    const {
      data: { id: campaignId },
    } = await axios.post(
      `https://${prefix}.api.mailchimp.com/3.0/campaigns`,
      campaignData,
      { headers },
    );

    await axios.put(
      `https://${prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
      { html: content },
      { headers },
    );

    await axios.post(
      `https://${prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      {},
      { headers },
    );
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
};

const sendSpecificBulkEmail = async payload => {
  const { emails, subject, fromName, content } = payload;

  try {
    const {
      data: { id: segmentId },
    } = await axios.post(
      `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}/segments`,
      {
        name: 'Selected Contacts',
        options: {
          match: 'any',
          conditions: emails.map(email => ({
            condition_type: 'EmailAddress',
            field: 'EMAIL',
            op: 'contains',
            value: email,
          })),
        },
      },
      { headers },
    );

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
          subject_line: subject,
          title: subject,
          from_name: fromName,
          reply_to: mailchimpEmail,
        },
      },
      { headers },
    );

    await axios.put(
      `https://${prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/content`,
      { html: content },
      { headers },
    );

    await axios.post(
      `https://${prefix}.api.mailchimp.com/3.0/campaigns/${campaignId}/actions/send`,
      {},
      { headers },
    );
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'something went wrong');
  }
};

const getSubscribedUsers = async (filters, paginationOptions) => {
  const { searchTerm, ...filtersData } = filters;

  const { page, limit, sortBy, sortOrder } =
    PaginationHelpers.calculationPagination(paginationOptions);

  const params = {
    offset: (page - 1) * limit,
    count: limit,
    status: 'subscribed',
  };

  const memberUrl = `https://${prefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

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
  sendSpecificBulkEmail,
  getSubscribedUsers,
};
