const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    fullname: {type: String, required: true},
    password: {type: String, required: true, unique: true, minlength: 8},
    username: {type: String, required: true, unique: true},
    bio: {type: String},
    image: {type: String}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
