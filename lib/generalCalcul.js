function generalCalcul(data) {
  const {height, weight, age, gender, activity, objective} = data;
  var activityRatio = 0,
    basalMetabolism = 0,
    dietRatio = 0,
    objectiveNeed = 0;

  if (gender === "Female") {
    basalMetabolism = Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  } else {
    basalMetabolism = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }

  switch (activity) {
    case "Sedentary":
      activityRatio = 1.2;
      break;
    case "Little Active":
      activityRatio = 1.375;
      break;
    case "Moderately Active":
      activityRatio = 1.55;
      break;
    case "Very Acive":
      activityRatio = 1.725;
      break;
    case "Hyper Active":
      activityRatio = 1.9;
      break;
  }

  switch (objective) {
    case "Weight Loss":
      dietRatio = -20 / 100;
      break;
    case "Slow Weight Loss":
      dietRatio = -10 / 100;
      break;
    case "Maintain":
      dietRatio = 1;
      break;
    case "Slow Weight Gain":
      dietRatio = 10 / 100;
      break;
    case "Weight Gain":
      dietRatio = 20 / 100;
      break;
  }

  protein = water = Math.round((weight - 20) * 15 + 1500);
  metabolismNeed = Math.round(basalMetabolism * activityRatio);
  bmi = Math.round((weight / Math.pow(height, 2)) * 10000);
  objectiveNeed = Math.round(metabolismNeed + (metabolismNeed * dietRatio));

  return {water, basalMetabolism, metabolismNeed, bmi, objectiveNeed};
}

module.exports = generalCalcul;