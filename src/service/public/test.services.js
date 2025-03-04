import { Invoice } from '../../model/invoice.model.js';
import { sendOrderInvoiceToCustomer } from '../../shared/nodeMailer.js';

const test = async payload => {
  const invoice = await Invoice.findById('67c6c89b9658ad32d78cfdd0');

  await sendOrderInvoiceToCustomer(invoice._doc);
};

export const TestService = {
  test,
};
