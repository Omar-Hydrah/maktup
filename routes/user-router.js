var router         = require("express").Router();
var RoomController = require("../controllers/room-controller.js");
var User           = require("../models/user-model.js");
var Helpers        = require("../functions/helpers.js");
var colors         = require("colors");
// Colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey
// Background: bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite



router.get(/^\/$|^\/home$|^\/index$/, function(req, res){

	/* Displays all online rooms */
	RoomController.getOnlineRooms().then(function(rooms){
		res.render("user/index", {onlineRooms: rooms});

	}).catch(function(err){
		res.send("Error occured");
	});
});

/* Displays user information */
router.get("/profile", function(req, res){
	res.render("user/profile", {user: req.session.user});
});

/* 
Shows all rooms created by the user. 
Enables creating new rooms through a form.
*/
router.get("/rooms", function(req, res){

	var userId = req.session.user.id;

	/* Rooms owned by the current user (session). */
	RoomController.getUserRooms(userId)
	.then(function(rooms){
		res.render("user/rooms", {rooms: rooms});
		
	}).catch(function(err){
		res.send("Error occured.");
	});
});

/* 
Updates user information (email, username, and password) 
through ajax.
*/
router.post("/update-profile", function(req, res){
	// Handle information edit.
	var user     = req.session.user;
	var usernameValue = req.body.username;
	var emailValue    = req.body.email;
	var passwordValue = req.body.password;


	// Values to be updated.
	var username;
	var email;
	var password;

	// Null values will not be updated in the mongoose query.
	if(usernameValue == null){
		username = null;
	}
	if(passwordValue == null){
		password = null;
	}
	if(emailValue == null){
		email = null;
	}
	

	// If there's a username/password, it shouldn't be less than 4 characters.
	// The server by default sends null, for values that
	//		 the user didn't wish to change.
	if(username != null && username.length < 4){
		return res.send("Username must be more than 4 characters");
	}
	if(password != null && password.length < 4 ){
		return res.send("Password must be at least 4 characters");
	}
	// Matches the email using regex.
	if(email != null && !Helpers.isValidEmail(email)){
		return res.send("Invalid email");
	}

	// object to be used in update query.
	var updatedUser = {
		username: (username == null) ? user.name : username,
		password: (password == null) ? user.password : password,
		email   : (email    == null) ? user.email : email
	};
	console.log(updatedUser);
	// Finding the user by the old email.
	/*User.findOneAndUpdate({email: user.email}, updatedUser, (err, doc)=>{
		if(err){return res.send("Failed to update.");}
		console.log(doc);
		return res.send("Updated user " + user.id);
	});*/
	/*User.update({email: user.email}, {$set: updatedUser}, (err, doc)=>{
		if(err){return res.send("Failed to update.");}
		console.log(doc);
		return res.send("Updated user " + user.id);
	});*/
	
});

router.get("/logout", function(req, res){
	req.logout();
	req.session = null;
	res.redirect("/");
});


module.exports = router;