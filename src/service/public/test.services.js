import { Invoice } from '../../model/invoice.model.js';
import {
  sendOrderInvoiceToCustomer,
} from '../../shared/nodeMailer.js';

const test = async payload => {
  const newInvoice = {
    invoiceId: "123",
    transactionId: "123",
    orderId: "123",
    name: "123",
    email: "rumanislam0429@gmail.com",
    phone: "123",
    subtotal: 0,
    shipping: 0,
    total: 0,
    items: [],
  };

  const createdInvoice = await Invoice.create(newInvoice);

   await sendOrderInvoiceToCustomer(createdInvoice.toObject());
};

export const TestService = {
  test,
};
