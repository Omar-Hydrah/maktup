var router     = require("express").Router();
// Custom middleware (Authentication)
var middleware = require("../middleware/middleware.js");
var RoomController = require("../controllers/room-controller.js");


router.get(/^\/$|^\/home$|^\/index$/, function(req, res){
	res.render("user/index");
});

router.get("/profile", function(req, res){
	res.render("user/profile");
});

router.get("/rooms", function(req, res){

	var userId = req.session.user.id;

	// Rooms owned by the current user (session).
	RoomController.getUserRooms(userId)
	.then(function(rooms){
		res.render("user/rooms", {rooms: rooms});
		
	}).catch(function(err){

	});
});

router.get("/logout", function(req, res){
	req.logout();
	req.session = null;
	res.redirect("/");
});


module.exports = router;