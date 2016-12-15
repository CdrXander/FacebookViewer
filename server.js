var express 		= require('express');
var session			= require('express-session')
var bodyParser 		= require('body-parser');
var passport 		= require('passport');
var fbStrategy		= require('passport-facebook');
var config 			= require('./config.js')


var port = 3000;

var app = express();

app.use(bodyParser.json());

//Init Passport Security
app.use(session({secret: config.secret}));
app.use(passport.initialize());
app.use(passport.session());

//Define FB Authentication Strategy
passport.use('facebook', new fbStrategy({
	clientID:config.fbAppId,
	clientSecret:config.fbAppSecret,
	callbackURL:"http://localhost:"+port+"/auth/facebook/callback"
}, function(token, refreshToken, profile, done) {
	return done(null, profile);
}))

//STEP JUST BEFORE THE USER IS ENTERED INTO THE SESSION
passport.serializeUser(function(user, done) {
  return done(null, user);
})

//STEP JUST BEFORE THE USER IS RETRIEVED FROM THE SESSION
passport.deserializeUser(function(user, done) {
  return done(null, user);
})

//END POINTS

app.get("/auth/facebook", passport.authenticate("facebook"));


app.get("/auth/facebook/callback", passport.authenticate('facebook'), function(req,res) {
	res.status(200).redirect('/me');
});

app.get("/me", function(req,res) {
	res.status(200).send(req.user);
})


app.listen(port, function() {
  console.log("Started server on port", port);
});