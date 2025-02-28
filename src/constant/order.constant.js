export const orderSearchableFields = [
  'email',
  'orderId',
  'user.userId',
  'user.email',
  'user.firstName',
  'user.lastName',
];

export const orderFilterableField = [
  'searchTerm',
  'deliveryStatus',
  'paymentStatus',
  'customerType',
];

export const deliverStatus = ['pending', 'completed'];

export const paymentStatus = ['unpaid', 'paid'];

export const customerType = ['user', 'guest'];
