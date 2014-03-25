// config/passport.js

var FitbitStrategy = require('passport-fitbit').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport){
  passport.serializeUser(function(user,done){
    console.log('user.id ---> '+user.id);
    done(null,user.id);
  });

  passport.deserializeUser(function(user,done){
    done(null,user);
  });

//  passport.deserializeUser(function(id,done){
//    User.findById(id,function(err,User){
//      done(err,User);
//    });
//  });

  passport.use(new FitbitStrategy({

    consumerKey : configAuth.fitbitAuth.consumerKey,
    consumerSecret : configAuth.fitbitAuth.consumerSecret,
    callbackURL : configAuth.fitbitAuth.callbackURL

  },
  function(token, tokenSecret, profile, done){

  process.nextTick(function(){
    console.log('token '+token);
    console.log('tokensecret '+tokenSecret);
    console.log('profile: '+profile._json.user.fullName);
    console.log('profileID: '+profile.id);
    //console.log(done);
    var logicGate = false;
  User.findOne({id:profile.id},function(err, item){  //if profile.id exists in db
    if(item){
      console.log('found profile id and updating');
      item.update(
      {	  id:profile.id,
	  accessToken:token,
	  accessSecret: tokenSecret,
	  name: profile._json.user.fullName,
	  timezoneOffset: profile._json.user.offsetFromUTCMillis,
	  avatar:profile._json.user.avatar,
	  distanceUnit:profile._json.user.distanceUnit
      },
      { upsert: true },
	function(err, numberAffected){
	  if(err) console.error(err);
	    console.log('User updated '+numberAffected+' records.');
	    logicGate=true;
	  }
      );done(null,profile);}
    if(err){
      console.log('no profile found');
      User.create(
         {
          id:profile.id,
          accessToken:token,
          accessSecret: tokenSecret,
          name: profile._json.user.fullName,
          timezoneOffset: profile._json.user.offsetFromUTCMillis,
          avatar:profile._json.user.avatar,
          distanceUnit:profile._json.user.distanceUnit,
          setGoal:false,
	  calorieGoal:null,
	  stepGoal:null,
	  steps:0,
	  calories:0
	  });
      
      done(null,profile);}});
  });
}));};
