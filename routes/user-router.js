var router         = require("express").Router();
var RoomController = require("../controllers/room-controller.js");


router.get(/^\/$|^\/home$|^\/index$/, function(req, res){

	// Displays all online rooms.
	RoomController.getOnlineRooms().then(function(rooms){
		res.render("user/index", {onlineRooms: rooms});
		// console.log(rooms);
	}).catch(function(err){
		res.send("Error occured");
	});
});

router.get("/profile", function(req, res){
	res.render("user/profile", {user: req.session.user});
});

router.get("/rooms", function(req, res){

	var userId = req.session.user.id;

	// Rooms owned by the current user (session).
	RoomController.getUserRooms(userId)
	.then(function(rooms){
		res.render("user/rooms", {rooms: rooms});
		
	}).catch(function(err){
		res.send("Error occured.");
	});
});

router.get("/logout", function(req, res){
	req.logout();
	req.session = null;
	res.redirect("/");
});


module.exports = router;