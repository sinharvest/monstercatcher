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
    console.log('USER   '+User);
  User.findOne({id:profile.id},function(err, item){  //if profile.id exists in db
    console.log('inside findOne');
    console.log('item is::: ' +item);
    console.log('error is::: ' +err);
    if(item){
      console.log('found profile id and updating');
      item.update(
                 {
                 	id:profile.id,
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
	               }
      );
    done(null,profile);
    }
    
    if(err || item==null){
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
	        calorieGoal:9001,
	        stepGoal:9001,
	        steps:0,
	        calories:0
	       }
      );  
      done(null,profile);
    }
  });
  });
}));};
