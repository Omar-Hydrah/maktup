var Room = require("../models/room-model.js");
var User = require("../models/user-model.js");

var Controller = {};


// Creates a new Room object, and saves it to database.
// Takes a callback.
Controller.saveRoom = function(roomObject, user, done){

	// var room = Room.createRoom(roomObject);
	var room = new Room({
		owner  : roomObject.owner,
		ownerId: roomObject.ownerId,
		title  : roomObject.title
	});
	room.generateLink(); // Automatically generates a link.

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

// Retrieves all rooms
Controller.getRooms = function(){

	return new Promise(function(resolve, reject){
		Room.find(function(err, rooms){
			if(err){reject(err);}
			resolve(rooms);
		});	
	});
}

// Retrieves rooms that have online members
Controller.getOnlineRooms = function(){
	return new Promise(function(resolve, reject){
		Room.find({membersCount: {$ne: 0}}, function(err, rooms){
			if(err){reject(err);}
			resolve(rooms);
		});
	});
}

// Retrieves all rooms created by a single user.
// Rooms are displayed under user profile
Controller.getUserRooms = function(userId){
	return new Promise(function(resolve, reject){

		Room.find({ownerId: userId}, function(err, rooms){
			if(err){reject(err);}

			resolve(rooms);
		});
	});	
}

module.exports = Controller;