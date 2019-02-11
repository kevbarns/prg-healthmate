const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, minlength: 2 },
    userName: { type: String, required: true, unique: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    encryptedPassword: { type: String, required: true }, // required might not be needed for connect modules (facebook, google, etc...)
    bio: { type: String, minlength: 10 },
    image: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["normal", "admin"],
      default: "normal"
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
