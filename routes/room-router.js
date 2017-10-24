var router     = require("express").Router();
var Room       = require("../models/room-model.js");
var User       = require("../models/user-model.js");

var RoomController = require("../controllers/room-controller.js");



// Serves index page - displays all online rooms
router.get(/^\/$|^\/home$|^\/index$/, function(req, res){

	// A promise to fetch all rooms
	RoomController.getRooms().then(function(rooms){
		res.render("rooms/index", {rooms: rooms});
		
	}).catch(function(err){
		throw err;
	});
});

router.get("/rooms/room", function(req, res){
	// Unaccessible - no room link was provided.
	res.redirect("/rooms/");
});

// Enters a room.
router.get("/rooms/room/:link", function(req, res){
	// Display a single room
});

// Creates a new room
router.post("/new", function(req, res){
	var user = req.session.user;

	var room = {
		owner  : user.username,
		ownerId: user.id,
		title  : req.body.roomName
	};

	// Creates the room instance, and saves it to database.
	// Then saves the room id to the owner user in the database.
	RoomController.saveRoom(room, user, function(err, room){
		if(err){throw err;}
		console.log(`${room.title} was created successfully`);
		res.redirect("/rooms/");		
	});

});


module.exports = router;