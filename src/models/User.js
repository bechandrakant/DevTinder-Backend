const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const privateKey = "DevTinder@20";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) throw new Error("Invalid Email");
      },
    },
    password: { type: String, minLength: 8 },
    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female"],
        message: `{VALUE} is not a valid gender`,
      },
    },
    age: { type: Number, min: 18 },
    photoUrl: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid&w=740",
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ id: user._id }, privateKey);
  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcrypt.compare(inputPassword, passwordHash);
  if (!isValidPassword) throw new Error("Invalid credentials");
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
