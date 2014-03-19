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
    trophies: [Boolean]  
});
//fitbitSchema.set('_id',false);
module.exports = mongoose.model('User',fitbitSchema);
