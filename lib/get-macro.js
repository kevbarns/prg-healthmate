function getMacro(data) {
  const protein = data[0].dietReference[0].data.protein,
    lipid = data[0].dietReference[0].data.lipid,
    carbs = data[0].dietReference[0].data.carbs,
    objectiveNeed = data[0].objectiveNeed;

  userProtein = Math.round((objectiveNeed * protein) / 100 / 4);
  userLipid = Math.round((objectiveNeed * lipid) / 100 / 9);
  userCarbs = Math.round((objectiveNeed * carbs) / 100 / 4);

  return {userProtein, userLipid, userCarbs};
}

module.exports = getMacro;
