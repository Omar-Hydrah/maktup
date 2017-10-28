var Room = require("../models/room-model.js");
var User = require("../models/user-model.js");

var UserController = require("./user-controller.js");

// mongoose.Types.ObjectId();
// document._id.equals(stringId);

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

// Adds a username to room.namesList[] and userId to room.onlineUsers.
Controller.addOnlineUser = function(userId , room){
	UserController.findUserById(userId).then((user)=>{
		var username = user.username;
		
	}).catch((err)=>{

	});
}

// Activiates a single room, after a user enters it.
// Increases the usersCount  +1, and inserts the userId in the onlineUsers[]
Controller.enterRoom = function(userId, rawLink){
	console.log(`rawLink (enterRoom) ${rawLink}`);
	console.log(`userId (enterRoom) ${userId}`);
	var user;

	Controller.findRoomByLink(rawLink).then((room)=>{

		// Works on the array of online users.
		var userIndex = locateUserIndex(room.onlineUsers, userId);
		// console.log("userIndex: ", userIndex);
		// If the user is already not in this room, add the user.
		// And insert the user's name into room.namesList[]
		if(userIndex == -1){
			 // Add the user to the list.
			room.onlineUsers.push(userId);

			// console.log(room.onlineUsers);
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
	console.log(`rawLink (exitRoom) ${rawLink}`);
	console.log(`userId (exitRoom) ${userId}`);


	Controller.findRoomByLink(rawLink).then((room)=>{
		// console.log("115");
		// console.log(room.onlineUsers);

		var userIndex = locateUserIndex(room.onlineUsers, userId);
		// console.log("userIndex: ", userIndex);
		// Remove the user if he is in the room
		if(userIndex != -1){
			// console.log("122");
			// console.log(room.onlineUsers);
			// Remove the userId from the onlineUsers[] using splice().
			var userIndex = room.onlineUsers.indexOf(userId._id);
			room.onlineUsers.splice(userIndex, 1);

			// console.log(`${userId} is leaving room`);

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

// Finds a single room by its link.
// To be swapped with findRoomByLink
Controller.getRoomByLink = function(rawLink){
	return new Promise(function(resolve, reject){

		Room.findOne({rawLink: rawLink}, function(err, room){
			if(err){reject(err);}

			resolve(room);
		});
	});
}

// Returns the index of a user inside room.onlineUsers (ObjectId)
function locateUserIndex(usersList, userId){
	var index = -1;
	for(var i = 0; i < usersList.length; i++){
		if(usersList[i].equals(userId)){
			index = i;
			return index;
		}
	}
	return index;
}

module.exports = Controller;