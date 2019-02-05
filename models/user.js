const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {type: String, required: true},
    password: {type: String, required: true, unique: true, minlength: 8},
    username: {type: String, required: true, unique: true},
    bio: {type: String},
    image: {data: Buffer, contentType: String}
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
