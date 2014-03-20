var User = require('./models/user');
var request = require('request');
var moment = require('moment');
var configAuth = require('../config/auth.js');
var Fitbit = require('fitbit');

//app/routes.js
module.exports = function(app, passport, db){

//homepage	
  app.get('/', function(req, res){
    res.render('index.ejs');
  });

//login
  app.get('/login', function(req, res){
    res.render('login.ejs', {message:req.flash('loginMessage')});
  });  

//omitted signup part of tutorial

//===============profile section================================
  app.get('/profile',isLoggedIn, function(req,res){
//	console.log('req is ::::: '+req.name);
//	console.log('req.user ::::: '+req.user);
        var query = User.where({id:req.user});
	query.findOne(function(err, kitten){console.log('kitty ='+kitten);
	var info = kitten;
//        console.log("setGoal is :  "+kitten.setGoal);	
//	console.log('SWAG = '+query);//findOne({ '': 'Ghost' },
        

        //use request for fitbit api to get activities information
//	var options = {
  //        url: '/1/user/-/activities/date/'+moment().format(YYYY-MM-DD)+'.json',
//	  headers: {
//		    'api.fitbit.com',
//		    'OAuth oauth_consumer_key='+fitbitAuth.consumerKey,
//		    kitten.accessToken,
//		    "HMAC-SHA1",
//		    "1.0"
//	           }
//	};
//
///	function callback(error, response, body) {
///		    if (!error && response.statusCode == 200) {
//			            var info = JSON.parse(body);
//				            console.log(info.stargazers_count + " Stars");
//					            console.log(info.forks_count + " Forks");
//						        }
//	}
//
//	request(options, callback);
        client = new Fitbit(
		configAuth.fitbitAuth.consumerKey,
		configAuth.fitbitAuth.consumerSecret,
		{
		accessToken: kitten.accessToken,
		accessTokenSecret: kitten.accessSecret,
		unitMeasure: 'en_GB'
		}
	);
	//get todays activities
	client.getActivities(function(err,activities){
		if(err){console.log('FAILLLL'); return;}
		console.log('success! steps are '+activities.steps());
		console.log('success! calories are '+activities.activityCalories());
	});


        res.render('profile.ejs', {
	  user:kitten//pass user to template
	});
    });
  });

//trophy case
  app.get('/trophy',isLoggedIn,function(req,res){
    var query = User.where({id:req.user});
    query.findOne(function(err, kitten){console.log('kitty ='+kitten);
      res.render('trophy.ejs', {
	user:kitten
      });
    });
  });


//logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
//favicon
//
 // app.get('/favicon.ico', function(req,res){
   // if (req.url === '/favicon.ico') {
     //   res.writeHead(200, {'Content-Type': 'images/x-icon'} );
//	    return res.end();
//	    }
 // });

//route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
      return next();
    res.redirect('/');
  }
//fitbit routes
  app.get('/auth/fitbit',passport.authenticate('fitbit'),function(req,res){});

  app.get('/auth/fitbit/callback',
    passport.authenticate('fitbit',{failureRedirect:'/'}),
    function(req,res){
      res.redirect('/profile');
    });
};
