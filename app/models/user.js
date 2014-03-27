var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');
//make a schema
var fitbitSchema = mongoose.Schema({
    id : String,
    accessToken : String,
    accessSecret : String,
    name : String,
    timezoneOffset:String,
    avatar: String,
    distanceUnit: String,
    trophies: {
      monster0:Boolean,
      monster1:Boolean,
      monster2:Boolean,
      monster3:Boolean,
      monster4:Boolean,
      monster5:Boolean,
      monster6:Boolean,
      monster7:Boolean
    },
    setGoal: Boolean,
    calorieGoal: Number,
    stepGoal: Number,
    steps: Number,
    calories: Number 
});
fitbitSchema.set('_id',false);
module.exports = mongoose.model('User',fitbitSchema);
