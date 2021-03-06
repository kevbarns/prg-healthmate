const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    height: {type: Number, required: true},
    weight: {type: Number, required: true},
    age: {type: Number, required: true},
    gender: {type: String, enum: ["Male", "Female"]},
    activity: {
      type: String,
      enum: [
        "Sedentary",
        "Little Active",
        "Moderately Active",
        "Very Active",
        "Hyper Active"
      ]
    },
    objective: {
      type: String,
      enum: [
        "Weight Loss",
        "Slow Weight Loss",
        "Maintain",
        "Slow Weight Gain",
        "Weight Gain"
      ]
    }
  },
  {
    timestamps: true
  }
);

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

module.exports = UserProfile;
