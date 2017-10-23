var Room = require("../models/room-model.js");
var User = require("../models/user-model.js");

var Controller = {};

Controller.saveRoom = function(roomObject, user, done){

	// var room = Room.createRoom(roomObject);
	var room = new Room({
		owner  : roomObject.owner,
		ownerId: roomObject.ownerId,
		title  : roomObject.title
	});
	room.generateLink(); // Automatically generates a link.
	
	console.log(room.save);
	room.save(function(err){
		if(err){throw err;} // Error

		User.findById(user.id, function(err, userInstance){
			if(err){throw err;} // Error
			userInstance.rooms.push(room.id);
			userInstance.save(function(err){
				if(err){throw err;} // Error
			});
		});
	});

	// callback(error, roomInstance).
	return done(null, room);
}

module.exports = Controller;