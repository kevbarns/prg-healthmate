const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserProfileSchema = new Schema(
  {
    username_id: [{type: ObjectId, ref: "User"}],
    height: {type: Decimal32, required: true},
    weight: {type: Decimal32, required: true},
    gender: {type: String, enum: ["Man", "Woman"]},
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
