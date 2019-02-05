const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDataSchema = new Schema(
  {
    username: [Schema.Types.ObjectId],
    basalMetabolism: {type: Number},
    imc: {type: Decimal32},
    bodyFat: {type: Decimal32},
    water: {type: Number},
    diet: {
      // Comment MAPPER les valeurs des macro avec chaque enum à part dans le code ?
      type: String,
      enum: [
        "Balanced",
        "Moderate",
        "Fitness",
        "Mediterranean",
        "Low Fat",
        "Low Carbs",
        "Body Builder",
        "Ketogenic"
      ]
    },
    dailyNeed: {type: Array},
    mealNeed: {type: Array}
  },
  {timestamps: true}
);

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = UserData;
