const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDataSchema = new Schema(
  {
    username_id: [{type: Schema.Types.ObjectId, ref: "User"}],
    basalMetabolism: {type: Number},
    bmi: {type: Number},
    bodyFat: {type: Number},
    water: {type: Number},
    diet: {type: Schema.Types.ObjectId, ref:"DietData"},
    dailyNeed: {type: Array}
  },
  {timestamps: true}
);

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = UserData;
