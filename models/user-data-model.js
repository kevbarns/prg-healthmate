const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDataSchema = new Schema(
  {
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    basalMetabolism: {type: Number},
    bmi: {type: Number},
    bodyFat: {type: Number},
    water: {type: Number},
    dietReference: [{data:{type: Schema.Types.ObjectId, ref: "DietData"}}],
    objectiveNeed: {type: Number},
    metabolismNeed: {type: Number}
  },
  {timestamps: true}
);

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = UserData;
