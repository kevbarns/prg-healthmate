const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, minlength: 2 },
    email: { type: String, unique: true, match: /^.+@.+\..+$/ },
    encryptedPassword: { type: String }, // required might not be needed for connect modules (facebook, google, etc...)
    bio: { type: String, minlength: 10 },
    image: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["normal", "admin"],
      default: "normal"
    },
    slackID: String,
    googleID: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
