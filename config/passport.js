// config/passport.js

var FitbitStrategy = require('passport-fitbit').Strategy;

var User = require('../app/models/user');

var configAuth = require('./auth');

module.exports = function(passport){
  passport.serializeUser(function(user,done){
    done(null,user);
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
    console.log(done);
  	User.update(
	    {
		id:profile.id,
		accessToken:token,
		accessSecret: tokenSecret,
		name: profile._json.user.fullName,
		timezoneOffset: profile._json.user.offsetFromUTCMillis
		
            },
	    { upsert: true },
	    function(err, numberAffected){
	    	if(err) console.error(err);
		console.log('User updated '+numberAffected+' records.');
            }
    );

    done(null,profile);
    });
  }
));
};
