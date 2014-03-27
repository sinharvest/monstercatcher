var User = require('./models/user');
var request = require('request');
var moment = require('moment');
var configAuth = require('../config/auth.js');
var Fitbit = require('fitbit');
var trophyLogic = require('../config/trophylogic.js');
//app/routes.js
module.exports = function(app, passport){

//homepage	
  app.get('/', function(req, res){
    res.render('index.ejs');
  });

//login
  app.get('/login', function(req, res){
    res.render('login.ejs', {message:req.flash('loginMessage')});
  });  

//testspace
  app.get('/test', function(req, res){
    trophyLogic.trophyOfTheDay();
  });

//omitted signup part of tutorial

//===============profile section================================
  app.get('/profile',isLoggedIn, function(req,res){
	console.log('req is ::::: '+req.name);
	console.log('req.user ::::: '+req.user);
        var query = User.where({id:req.user});
	query.findOne(function(err, kitten){console.log('kitty ='+kitten);
       
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
	  User.findOne({id:req.user},function(err,item){
            if(err){
	      console.log('failed to find user');
	      }
	    if(item){
	      item.steps=activities.steps();
	      item.calories=activities.activityCalories();
	      //if goals have been met award trophy
	      if(trophyLogic.trophyCatch(item.steps,item.stepGoal,item.calories,item.calorieGoal)){
                trophyLogic.trophyStore(item); 	      
	      }else{console.log('no trophy awarded yet!');}
	      res.render('profile.ejs',{user:item,trophy:trophyLogic.trophyOfTheDayImage()});  
	    }
	  });
	  
	//	User.update({id:req.user},{steps:900},function(err,numaffected,whatever){if(err){console.log('update err');}});
	//	kitten.steps = activities.steps();
	//	kitten.calories = activities.activityCalories();
		

     //   res.render('profile.ejs', {
//	  user:kitten//pass user to template
//	});
	});

    });
  });

//trophy case
  app.get('/trophy',isLoggedIn,function(req,res){
    var query = User.where({id:req.user});
    query.findOne(function(err, kitten){console.log('kitty ='+kitten);
      res.render('trophy.ejs', {
	user:User
      });
    });
  });


//logout
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

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
