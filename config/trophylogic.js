var User = require('../app/models/user');
var moment = require('moment');

exports.trophyCatch = function(stepsTaken, stepGoal, caloriesBurned, calorieGoal){
  if(stepsTaken>=stepGoal){
    console.log("steps goal fulfilled");
  }
  if(caloriesBurned>=calorieGoal){
    console.log("calorie goal fulfilled");
  }
  if(stepsTaken>=stepGoal&&caloriesBurned>=calorieGoal){
    return true;
  }else{return false;}
}

exports.trophyOfTheDayImage = function(){
  var located = 'images/monsters/'+(moment().get('date')%8)+'.png';
  console.log(located);
  return located;
}

exports.trophyOfTheDayNumber = function(){
  var number = moment().get('date')%8;
  return number;
}

exports.trophyStore = function(item){
  if(trophyOfTheDayNumber==0){
    item.trophies.monster0=true;
  }
  if(trophyOfTheDayNumber==1){
    item.trophies.monster1=true;
  }
  if(trophyOfTheDayNumber==2){
    item.trophies.monster2=true;
  }
  if(trophyOfTheDayNumber==3){
    item.trophies.monster3=true;
  }
  if(trophyOfTheDayNumber==4){
    item.trophies.monster4=true;
  }
  if(trophyOfTheDayNumber==5){
    item.trophies.monster5=true;
  }
  if(trophyOfTheDayNumber==6){
    item.trophies.monster6=true;
  }
  if(trophyOfTheDayNumber==7){
    item.trophies.monster7=true;
  }
}
