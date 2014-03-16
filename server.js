//server.js
//set up ========================================
var express = require('express'),
    mongoose = require('mongoose'),
    app = express(),
    port = process.env.PORT || 8080,
    flash = require('connect-flash'),
    configDB = require('./config/database.js');
 
var passport = require('passport');
//Configuration==================================
var db = mongoose.connection;
mongoose.connect(configDB.url);//connect to the db
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('the db has been connected');
});

require('./config/passport')(passport);//pass passport for configuration

app.configure(function(){
	//set up epxress app
	app.use(express.logger('dev'));//log every req to the console
	app.use(express.cookieParser());//read cookies(needed for auth)
	app.use(express.bodyParser());//get information from html forms

	app.set('view engine', 'ejs');//ejs is set as template engine

	//required for passport
	app.use(express.session({secret:'secretsarenofuntrollololololol'}));
	app.use(passport.initialize());
	app.use(passport.session());//persistent login sessions
	app.use(flash());//use connect-flash for flash messages stored in session

});

//routes ========================================
require('./app/routes.js')(app, passport);//load our routes and pass in our app a fully configured passport

//launch ========================================
app.listen(port);
console.log('Magic port on' + port);
