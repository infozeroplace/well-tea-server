import ejs from 'ejs';
import httpStatus from 'http-status';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/index.js';
import ApiError from '../error/ApiError.js';
import { System } from '../model/system.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: 'churchlogo.co',
  port: 587,
  secure: false,
  auth: {
    user: config.support_mail_address,
    pass: config.nodemailer_pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendPromotionalEmail = async () => {
  const emailTemplate = `
  <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f9f9f9; padding: 20px;">
    <div style="background: #ffffff; padding: 20px; max-width: 600px; margin: auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2>Lower costs with Fluid compute</h2>
      <p style="font-size: 16px; color: #333;">Hello Tea Lover,</p>
      <p style="font-size: 16px; color: #555;">We’re giving you an exclusive <strong>25% OFF</strong> your first order. ☕✨</p>
      <div style="background: #f3f3f3; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p style="margin: 5px 0;">🌿 <strong>Premium Teas</strong> Handpicked for You</p>
        <p style="margin: 5px 0;">🛍️ <strong>25% Off</strong> Your First Purchase</p>
        <p style="margin: 5px 0;">🚚 <strong>Fast & Fresh</strong> Delivery</p>
      </div>
      <p style="font-size: 18px; font-weight: bold; color: #d35400;">
        Use Code: <span style="background: #ffeb3b; padding: 5px 10px; border-radius: 5px;">WELCOME25</span>
      </p>
      <a href="https://docs.google.com/spreadsheets/d/1BDpDicUDzQsENGwBv_PfO29MqNZ8qBO_E_URASZIVGc/edit?gid=0#gid=0" 
        style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 18px; margin-top: 10px;">
        🛒 Shop Now & Save 25%
      </a>
      <p style="font-size: 14px; color: #888; margin-top: 15px;">Hurry! This offer won’t last forever.</p>
      <br/>
      <p style="font-size: 16px; color: #333;"><em>Sip, Relax & Enjoy,</em></p>
      <p style="font-size: 16px; font-weight: bold; color: #333;">The WellTea Team</p>
      <br/>
      <p style="font-size: 12px; color: #888;">
        P.S. Need recommendations? Our tea experts are here to help! 💌 <a href="mailto:support@welltea.com">Reply to this email anytime.</a>
      </p>
      <br/>
      <p style="font-size: 12px; color: #888;">
        Don't want these emails? <a href="mailto:unsubscribe@churchlogo.co">Unsubscribe here</a>.
      </p>
    </div>
  </div>
`;

  const mailOptions = {
    from: `"WellTea" <${config.support_mail_address}>`,
    to: 'rumanislam48@gmail.com',
    subject: 'Fluid compute is now available—up to 85% lower compute costs',
    headers: {
      'List-Unsubscribe': '<mailto:unsubscribe@churchlogo.co>',
    },
    html: emailTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send reset password email',
    );
  }
};

export const sendOrderDetailsToAdmin = async (invoice, email) => {
  const templatePath = path.join(__dirname, '../views/orderInvoice.ejs');

  ejs.renderFile(templatePath, invoice, async (err, template) => {
    if (err) {
      console.log(err);
    } else {
      const mailOptions = {
        from: `"ChurchLogo" <${config.invoice_mail_address}>`,
        to: email,
        subject: 'Invoice',
        html: template,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        return info;
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      }
    }
  });
};

export const sendOrderInvoiceToCustomer = async invoice => {
  const templatePath = path.join(__dirname, '../views/orderInvoice.ejs');

  ejs.renderFile(templatePath, invoice, async (err, template) => {
    if (err) {
      console.log(err);
    } else {
      const mailOptions = {
        from: `"ChurchLogo" <${config.invoice_mail_address}>`,
        to: invoice.email,
        subject: 'Invoice',
        html: template,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        return info;
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      }
    }
  });
};

export const sendForgotPasswordLink = async (email, name, token) => {
  const mailOptions = {
    from: `"ChurchLogo" <${config.support_mail_address}>`,
    to: email,
    subject: 'Reset Your WellTea Password',
    html: `
      <div style="width: 100%; padding: 20px 10px; font-size: 18px; font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h3>Hello, ${name}</h3>

        <p>
          We received a request to reset your WellTea account password. Please click the link below 
          <strong style="font-weight: 900;">within 15 minutes</strong> to reset your password:
        </p>

        <p style="margin: 30px 0;">
          <a 
            href="${config.frontend_base_url}/reset-password?token=${token}" 
            target="_blank" 
            style="
              padding: 12px 24px;
              background-color: #348edb;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 5px;
            "
          >
            Reset Your Password
          </a>
        </p>

        <p>
          If you didn’t request this password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>

        <p>
          Once your password is reset, you’ll be signed in and can access the member-only area.
        </p>

        <p style="margin: 40px 0 0;">
          Best regards, <br />
          <strong>WellTea Support Team</strong>
        </p>

        <footer style="margin-top: 40px; font-size: 14px; color: #777;">
            <p style="margin: 0;">For further assistance, contact us at:</p>
            <a 
              href="mailto:contact@welltea.co" 
              target="_blank" 
              style="color: #348edb; text-decoration: none; font-weight: bold;"
            >
              support@welltea.co
            </a>
            <p style="margin: 10px 0 0;">
              <a 
                href="${config.frontend_base_url}" 
                target="_blank" 
                style="color: #348edb; text-decoration: none;"
              >
                www.welltea.co
              </a>
            </p>
        </footer>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send reset password email',
    );
  }
};

export const sendAdminForgotPasswordLink = async (email, name, token) => {
  const mailOptions = {
    from: `"ChurchLogo" <${config.support_mail_address}>`,
    to: email,
    subject: 'Reset Your Admin Password - Church Logo Dashboard',
    html: `
      <div style="width: 100%; padding: 20px; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3>Dear, ${name}</h3>
        <p>
          We received a request to reset your password for the Church Logo Admin Dashboard.
          If you made this request, please click the link below <strong>within 24 hours</strong> to reset your password securely:
        </p>

        <p style="margin: 30px 0;">
          <a
            href="${config.admin_frontend_base_url}/reset-password/${token}"
            target="_blank"
            style="
              padding: 12px 24px;
              background-color: #348edb;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 5px;
              display: inline-block;
            "
          >
            Reset Your Password
          </a>
        </p>

        <p>
          If you did not make this request, please contact support immediately. For security purposes, this link will expire after 15 minutes.
        </p>
        <p>Once your password is reset, you will be signed in and able to access the Admin Dashboard.</p>

        <p>Warm regards,</p>
        <p><strong>The Church Logo Support Team</strong></p>

        <footer style="margin-top: 40px; font-size: 14px; color: #777;">
          <a
            href="${config.admin_frontend_base_url}"
            target="_blank"
            style="color: #348edb; text-decoration: none; font-weight: bold;"
          >
            www.admin.churchlogo.co
          </a>
        </footer>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
    );
  }
};

export const sendOtpToEmailChangeAdmin = async (email, otp) => {
  const { logo } = await System.findOne({
    systemId: 'system-1',
  }).populate({
    path: 'logo',
    select: 'filepath alternateText',
  });

  const templatePath = path.join(__dirname, '../views/otp-email.ejs');

  const data = {
    config,
    logo: config.server_url + logo.filepath,
    alternateText: logo.alternateText,
    otp,
  };

  ejs.renderFile(templatePath, data, async (err, template) => {
    if (err) {
      console.log(err);
    } else {
      const mailOptions = {
        from: `"ChurchLogo" <${config.support_mail_address}>`,
        to: email,
        subject: 'Your OTP Code',
        html: template,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        return info;
      } catch (error) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      }
    }
  });
};
