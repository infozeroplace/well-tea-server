import { Invoice } from '../../model/invoice.model.js';
import Order from '../../model/order.model.js';
import { sendOrderInvoiceToCustomer } from '../../shared/nodeMailer.js';

const test = async payload => {
  const order = await Order.findOne({ orderId: 'LS851TEGUNQ6' }).lean();
  const invoice = await Invoice.findOne({ invoiceId: 'QXRHSVNN9I2K' }).lean();

  const data = {
    ...order,
    ...invoice,
  };

  await sendOrderInvoiceToCustomer(data);

  return data;
};

export const TestService = {
  test,
};
