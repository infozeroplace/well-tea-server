import { Schema, model } from 'mongoose';

const OtpSchema = Schema(
  {
    email: {
      type: String,
      required: [true, 'email is required'],
    },
    userId: {
      type: String,
      required: [true, 'user id is required'],
    },
    code: {
      type: String,
      required: [true, 'code is required'],
    },
    expireIn: {
      type: Date,
      default: () => new Date(Date.now() + 180 * 1000),
    },
  },
  { timestamps: true },
);

OtpSchema.index({ expireIn: 1 }, { expireAfterSeconds: 0 });

const OTP = model('OTP', OtpSchema);

export default OTP;
