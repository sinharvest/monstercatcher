var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs');
//make a schema
var userSchema = mongoose.Schema({
  fitbit:{
    id : String,
    token : String,
    email : String,
    name : String
  }
});

module.exports = mongoose.model('User',userSchema);
