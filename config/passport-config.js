var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user-model.js");

passport.serializeUser(function(user, done){
	return done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		return done(err, user);
	});
});

// Login middleware
var loginStrategy = new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
}, function(req, email, password, done){

	User.findOne({email: email}, function(err, user){
		if(err){
			return done(err);
		}
		if(!user || !user.verifyPassword(password)){
			return done(null, false, req.flash("loginMessage", "Wrong email/password combination"));
		}

		return done(null, user);
	});
});

passport.use("login", loginStrategy);

// Register middleware
var registerStrategy = new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
}, function(req, email, password, done){
	var username = req.body.username;

	User.findOne({email: email}, function(err, oldUser){
		if(err){return done(err);}

		if(oldUser){
			return done(null, false, req.flash("registerMessage" ,"Email is already taken"));
		}

		if(!email || !password || !username){
			return done(null, false, req.flash("registerMessage", "All fields are required."));
		}

		// Creates a new user(static function).
		var user = new User();
		
		user.createUser(email, username, password);
		user.save(function(err){
			if(err){throw err;}
			req.session.username = user.username;

			return done(null, user);
		});	
	});
});

passport.use("register", registerStrategy);