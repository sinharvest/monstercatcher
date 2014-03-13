// config/passport.js

var FitbitStrategy = require('passport-fitbit').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport){
  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });

  passport.use(new FitbitStrategy({

    consumerKey : configAuth.fitbitAuth.consumerKey,
    consumerSecret : configAuth.fitbitAuth.consumerSecret,
    callbackURL : configAuth.fitbitAuth.callbackURL

  },
  function(token, tokenSecret, profile, done){
    
  }));
};
