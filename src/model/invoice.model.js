import { Schema, model } from 'mongoose';
import mongoosePlugin from 'mongoose-aggregate-paginate-v2';

const InvoiceSchema = Schema(
  {
    invoiceId: String,
    transactionId: String,
    orderId: String,
    name: String,
    email: String,
    phone: String,
    items: Array,
    subtotal: Number,
    shipping: Number,
    total: Number,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

InvoiceSchema.plugin(mongoosePlugin);

const Invoice = model('Invoice', InvoiceSchema);

export { Invoice };
