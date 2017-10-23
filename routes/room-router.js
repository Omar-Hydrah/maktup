var router     = require("express").Router();
var Room       = require("../models/room-model.js");
var User       = require("../models/user-model.js");
var RoomController = require("../controllers/room-controller.js");
// Custom middleware
var middleware = require("../middleware/middleware.js"); 

var isLoggedIn = middleware.isLoggedIn;


// Serves index page - displays all online rooms
router.get(/^\/$|^\/home$|^\/index$/, function(req, res){
	res.render("rooms/index");
});

router.get("/rooms/room", function(req, res){
	res.redirect("/rooms/");
});

router.get("/rooms/room/:link", function(req, res){

});

// Creates a new room
router.post("/new", function(req, res){
	var user = req.session.user;

	// console.log(`${user.username} is trying to create ${req.body.roomName}`);

	// Instantiating a new room.
	/*var room = Room.createRoom({
		owner  : user.username,
		ownerId: user.id,
		title  : req.body.roomName
	});*/
	var room = {
		owner  : user.username,
		ownerId: user.id,
		title  : req.body.roomName
	};

	/*room.save(function(err){
		if(err){throw err; }
		console.log(`${room.title} was created successfully`);

		// Saving the room id to the user object.
		// Promises might make the code cleaner
		User.findById(user.id, function(err, userObject){
			if(err){throw err;}

			// Appending the new room id to the list of the user's rooms.
			userObject.rooms.push(room.id); 
			userObject.save(function(err){
				if(err){throw err;}
			});
		});

	});*/
	// Creates the room instance, and saves it to database.
	// Then saves the room id to the owner user in the database.
	RoomController.saveRoom(room, user, function(err, room){
		if(err){throw err;}
		console.log(`${room.title} was created successfully`);
		res.redirect("/rooms/");		
	});

});


module.exports = router;