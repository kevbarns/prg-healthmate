const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DietDataSchema = new Schema({
  protein: {type: String, required: true},
  carbs: {type: String, required: true},
  lipid: {type: String, required: true},
  name: {type: String, required: true}
});

const DietData = mongoose.model("DietData", DietDataSchema);

module.exports = DietData;
