import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  env: process.env.NODE_ENV,
  port:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_PORT
      : process.env.DEVELOPMENT_PORT,

  database_url:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_DATABASE_URL
      : process.env.DEVELOPMENT_DATABASE_URL,

  frontend_base_url:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_FRONTEND_BASE_URL
      : process.env.DEVELOPMENT_FRONTEND_BASE_URL_DEV,

  admin_frontend_base_url:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_ADMIN_FRONTEND_BASE_URL
      : process.env.DEVELOPMENT_ADMIN_FRONTEND_BASE_URL_DEV,

  server_url:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_SERVER_URL
      : process.env.DEVELOPMENT_SERVER_URL,

  cookie_domain:
    process.env.NODE_ENV === 'production'
      ? process.env.PRODUCTION_COOKIE_DOMAIN
      : process.env.DEVELOPMENT_COOKIE_DOMAIN,

  origins:
    process.env.NODE_ENV === 'production'
      ? [
          process.env.PRODUCTION_FRONTEND_BASE_URL,
          process.env.PRODUCTION_ADMIN_FRONTEND_BASE_URL,
          process.env.PRODUCTION_FRONTEND_BASE_URL_WWW,
          process.env.PRODUCTION_ADMIN_FRONTEND_BASE_URL_WWW,
          process.env.DEVELOPMENT_FRONTEND_BASE_URL_DEV, // For testing purpose
          process.env.DEVELOPMENT_ADMIN_FRONTEND_BASE_URL_DEV, // For testing purpose
        ]
      : [
          process.env.DEVELOPMENT_FRONTEND_BASE_URL_DEV,
          process.env.DEVELOPMENT_ADMIN_FRONTEND_BASE_URL_DEV,
        ],

  stripe_secret_key:
    process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_SECRET_KEY_PROD
      : process.env.STRIPE_SECRET_KEY_DEV,

  stripe_publishable_key:
    process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_PUBLISHABLE_KEY_PROD
      : process.env.STRIPE_PUBLISHABLE_KEY_DEV,

  stripe_endpoint_secret_key:
    process.env.NODE_ENV === 'production'
      ? process.env.STRIPE_ENDPOINT_SECRET_KEY_PROD
      : process.env.STRIPE_ENDPOINT_SECRET_KEY_DEV,

  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_SECRET_EXPIRES_IN,
    email_expires_in: process.env.JWT_EMAIL_EXPIRES_IN,
  },

  sales_mail_address: process.env.SALES_MAIL_ADDRESS,
  support_mail_address: process.env.SUPPORT_MAIL_ADDRESS,
  nodemailer_pass: process.env.NODEMAILER_PASS,

  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,

  super_admin_role: process.env.SUPER_ADMIN_ROLE,

  mailchimp_api_key: process.env.MAILCHIMP_API_KEY,
  mailchimp_audience_id: process.env.MAILCHIMP_AUDIENCE_ID,
  mailchimp_server_prefix: process.env.MAILCHIMP_SERVER_PREFIX,
  mailchimp_email: process.env.MAILCHIMP_EMAIL,

  royal_mail_client_id: process.env.ROYAL_MAIL_CLIENT_ID,
  royal_mail_client_secret: process.env.ROYAL_MAIL_CLIENT_SECRET,

  instagram_client_id: process.env.INSTAGRAM_CLIENT_ID,
  instagram_client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
  instagram_redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
};

export default config;
