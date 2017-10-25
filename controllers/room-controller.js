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
		// Get all rooms were usersCount is not 0.
		Room.find({usersCount: {$ne: 0}}, function(err, rooms){
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

// Retrieves a list of a room's onlineUsers
Controller.getRoomOnlineUsers = function(rawLink){
	return new Promise((resolve, reject)=>{
		Controller.findRoomByLink(rawLink).then((room)=>{

			resolve(room.onlineUsers);

		}).catch((err)=>{
			reject(err);
		});
	});
}

// Activiates a single room, after a user enters it.
// Increases the usersCount  +1, and inserts the userId in the onlineUsers[]
Controller.enterRoom = function(userId, rawLink){

	Controller.findRoomByLink(rawLink).then((room)=>{
		// If the user is already not in this room, add the user.
		if(room.onlineUsers.indexOf(userId) == -1){
			room.onlineUsers.push(userId); // Add the user to the list.
			room.usersCount++;
			room.save((err)=>{
				if(err){throw err;}
			});
		}
	}).catch((err)=>{
		throw err;
	});
}

// Removes the user from the room, and sets the usersCount -1
Controller.exitRoom = function(userId, rawLink){
	Controller.findRoomByLink(rawLink).then((room)=>{
		// Remove the user if he is in the room
		if(room.onlineUsers.indexOf(userId) != -1){
			// Remove the userId from the onlineUsers[] using splice().
			room.onlineUsers.splice(room.onlineUsers.indexOf(userId), 1);

			room.usersCount--;
			room.save((err)=>{
				if(err){throw err;}
			});
		}
	}).catch((err)=>{
		throw err;
	});
}


// Finds a single room by its link.
Controller.findRoomByLink = function(rawLink){
	return new Promise(function(resolve, reject){

		Room.findOne({rawLink: rawLink}, function(err, room){
			if(err){reject(err);}

			resolve(room);
		});
	});
}

module.exports = Controller;