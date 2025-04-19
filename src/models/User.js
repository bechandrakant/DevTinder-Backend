const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Invalid gender");
        }
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

const User = mongoose.model("User", userSchema);

module.exports = User;
