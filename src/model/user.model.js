import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import mongoosePlugin from "mongoose-aggregate-paginate-v2";
import config from "../config/index.js";
import { departments, roles } from "../constant/members.constants.js";

const UserSchema = Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: [true, "User ID is required"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid URL format",
      ],
      required: [true, "Email address is required"],
    },
    firstName: {
      type: String,
      trim: true,
      min: [1, "Too small"],
      max: [15, "Too big"],
      required: [true, "First name is required!"],
    },
    lastName: {
      type: String,
      trim: true,
      min: [1, "Too small"],
      max: [15, "Too big"],
      required: [true, "Last name is required!"],
    },
    role: {
      type: String,
      enum: {
        values: roles,
        message: "{VALUE} is not matched",
      },
      default: "user",
    },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
    blockStatus: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      match: [
        /^(?=.*[A-Za-z0-9])(?=.*[^A-Za-z0-9]).{6,}$/,
        "Invalid password format",
      ],
      required: function () {
        return !this.isSocialLogin;
      },
    },
    resetToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

UserSchema.plugin(mongoosePlugin);

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.password) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

const User = model("User", UserSchema);

export default User;
