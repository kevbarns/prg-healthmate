const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDataSchema = new Schema(
  {
    username_id: [{type: Schema.Types.ObjectId, ref: "User"}],
    basalMetabolism: {type: Number},
    imc: {type: Number},
    bodyFat: {type: Number},
    water: {type: Number},
    // HOW TO STORE DIET TYPE SPLIT POURCENTAGE ?
    // V1
    diet: {
      balanced: {
        protein: 25,
        carbs: 50,
        lipid: 25
      }
    },
    // V2 STORE SPLIT POURCENTAGE IN THE CODE ? HOW TO MAP ? if diet.value === "Balanced" ?
    diet: {
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
    // V3
    dailyNeed: {
      protein: {type: Number},
      carbs: {type: Number},
      lipid: {type: Number}
    },
    mealNeed: {type: Array}
  },
  {timestamps: true}
);

const UserData = mongoose.model("UserData", UserDataSchema);

module.exports = UserData;
