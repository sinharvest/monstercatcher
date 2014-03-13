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

//omitted signup part of tutorial

//profile section

  app.get('/profile',isLoggedIn, function(req,res){
    res.render('profile.ejs', {
	user:req.user//pass user to template
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
  app.get('/auth/fitbit',passport.authenticate('fitbit'));

  app.get('/auth/fitbit/callback',
    passport.authenticate('fitbit',{
      successRedirect:'/profile',
      failureRedirect:'/'
    }));
};
