console.log("coucou");

var bmiButton = document.getElementById("bmi-button");
var bmiModal = document.getElementById("bmi-info");

bmiButton.onclick = function() {
  bmiModal.style.display = "block";
};

var foodieButton = document.getElementById("foodie-button");
var foodieInfo = document.getElementById("foodie-info");

foodieButton.onclick = function() {
  foodieInfo.style.display = "block";
};

var factsButton = document.getElementById("facts-button");
var factsInfo = document.getElementById("facts-info");

factsButton.onclick = function() {
  factsInfo.style.display = "block";
};

var closeBmi = document.getElementById("close-bmi");

closeBmi.onclick = function() {
  bmiModal.style.display = "none";
};

var closeFoodie = document.getElementById("close-foodie");

closeFoodie.onclick = function() {
  foodieInfo.style.display = "none";
};

var closeFacts = document.getElementById("close-facts");

closeFacts.onclick = function() {
  factsInfo.style.display = "none";
};
