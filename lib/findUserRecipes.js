function findUserRecipes(recipesList, userData) {
  let bProt = userData.macros[0].protein, // user protein
    bCarbs = userData.macros[0].carbs, // user carbs
    bLipid = userData.macros[0].lipid; //user lipid
  ratioProtToCarbs = bProt / bCarbs; // ratio protein/carbs
  let count = 0;
  let matchedRecipes = [];

  // Shuffle recipesList
  recipesList.sort(function() {
    return 0.5 - Math.random();
  });

  recipesList.forEach(e => {
    const recipeProt = e.protein,
      recipeCarbs = e.carbs,
      recipeLipid = e.lipid,
      ratioCarbsToProtRecipe = e.carbs / e.protein;

    if (bProt >= recipeProt && bCarbs >= recipeCarbs && bLipid >= recipeLipid) {
      if (ratioCarbsToProtRecipe <= 1) {
        bProt -= recipeProt;
        bCarbs -= recipeCarbs;
        bLipid -= recipeLipid;
        matchedRecipes.push(e._id);
        count++;
      } else if (ratioCarbsToProtRecipe > 2 && count < 6) {
        bProt -= recipeProt;
        bCarbs -= recipeCarbs;
        bLipid -= recipeLipid;
        matchedRecipes.push(e._id);
        count++;
      }
    }
  });
  return matchedRecipes;
}

module.exports = findUserRecipes;
