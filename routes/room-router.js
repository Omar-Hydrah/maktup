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
		// throw err;
		res.send("Error occured");
	});
});

router.get("/room", function(req, res){
	// Unaccessible - no room link was provided.
	res.redirect("/rooms/");
});

// Enter a room.
router.get("/room/:link", function(req, res){
	
	// Displays a single room
	RoomController.findRoomByLink(req.params.link)
	.then(function(room){
		res.render("rooms/room", {room: room});

	}).catch(function(err){

		res.send("Error occured");
	});
});

// Creates a new room
router.post("/new", function(req, res){
	var user = req.session.user;

	var room = {
		owner  : user.name,
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