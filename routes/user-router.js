var router         = require("express").Router();
var RoomController = require("../controllers/room-controller.js");
var UserController = require("../controllers/user-controller.js");
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
	// var user     = req.session.user;

	// Values to be updated. 
	// Unassigned - their values are assigned later.
	var username;
	var email;
	var password;

	// Errors from the update-user form.
	var formErrors = [];

	// Null values will not be updated in the mongoose query.
	if(req.body.username == null || req.body.username == ""){
		username = null;
	}else{
		username = req.body.username;
	}

	if(req.body.password == null || req.body.password == ""){
		password = null;
	}else{
		password = req.body.password;
	}

	if(req.body.email == null || req.body.email == ""){
		email = null;
	}else{
		email = req.body.email;
	}

	// object to be used in update query.
	// console.log("request user: ", req.body );
	

	// If there's a username/password, it shouldn't be less than 4 characters.
	// The server by default sends null, for values that
	//		 the user didn't wish to change.
	if(username != null && username.length < 4){
		formErrors.push("Username must be more than 4 characters");
	}
	if(password != null && password.length < 4 ){
		formErrors.push("Password must be at least 4 characters");
	}
	// Matches the email using regex.
	if(email != null && !Helpers.isValidEmail(email)){
		formErrors.push("Invalid email");
	}
	// console.log(formErrors);
	// console.log("form errors length: " + formErrors.length);

	var formResponse = {errors: formErrors};
	
	// If any errors exist:
	if(formResponse.errors.length > 0){
		return res.send(JSON.stringify(formResponse));
	}

	UserController.updateUser(req.session.user.email, username, email, password)
	.then((user)=>{
		// Saving new user info to session
		UserController.storeInSession(req, user);

		return res.send(JSON.stringify({message: "Updated user", errors: null}));		
	}).catch((err)=>{
		// console.log(err.message);

		if(err.code == "11000"){
			// Email exists in the database.
			return res.send(JSON.stringify({errors: ["Email already exists."]}));
		}else{
			// All the other errors:
			return res.send(JSON.stringify(
				{errors: ["Failed to update user. Try again later."]}
			));
		}
	});
	// Because null values can exist, The user must be found first,
	// to use its old attributes instead of saving "null" to database.
	/*User.findOne({email: req.session.user.email}, (err, user)=>{
		if(err){return res.send("Failed to process");}
		console.log("user values");
		console.log(username);
		console.log(email);
		console.log(password);
		user.name     = (username == null) ? user.name : username;
		user.email    = (email    == null) ? user.email: email;		
		user.password = (password == null) ? 
			user.password : User.hashPassword(password);
		user.save((err, user)=>{
			// 11000 for duplicate emails.
			if(err){console.log(err);}
			if(err && err.code && err.code == "11000"){
				return res.send("Email already exists");
			}
			console.log(user);

			return res.send("Updated user " + user.id);
		});
	});*/
	
});

router.get("/logout", function(req, res){
	req.logout();
	req.session = null;
	res.redirect("/");
});


module.exports = router;