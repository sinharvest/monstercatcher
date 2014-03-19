var User = require('./models/user');
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

//profile section
//show stats
  app.get('/profile',isLoggedIn, function(req,res){
	console.log('req is ::::: '+req.name);
	console.log('req.user ::::: '+req.user);
        var query = User.where({id:req.user});
	query.findOne(function(err, kitten){console.log('kitty ='+kitten);
	
	console.log('SWAG = '+query);//findOne({ '': 'Ghost' },
    res.render('profile.ejs', {
	user:kitten//pass user to template
	});
    });
  });

//trophy case
  app.get('/trophy',isLoggedIn,function(req,res){
    res.render('trophy.ejs',{
      user:req.user
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
