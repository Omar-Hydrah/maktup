var Room = require("../models/room-model.js");
var User = require("../models/user-model.js");

var UserController = require("./user-controller.js");

// mongoose.Types.ObjectId();
// document._id.equals(stringId);

// Number of promises should be reduced inside enterRoom, exitRoom
// addOnlineUser, and removeOnlineUser.

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
			userInstance.save(function(err, user){
				if(err){throw err;} // Error
			});
		});
	});

	// Series msitake.
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
			// console.log("Getting online users from " + rawLink);
			resolve(room.onlineUsers);

		}).catch((err)=>{
			reject(err);
		});
	});
}

// Finds a single room by its rawLink.
Controller.findRoomByLink = function(rawLink){
	return new Promise(function(resolve, reject){

		Room.findOne({rawLink: rawLink}, function(err, room){
			if(err){reject(err);}

			resolve(room);
		});
	});
}

// Adds a user object to room.onlineUsers.
Controller.addOnlineUser = function(user , room){
	return new Promise((resolve, reject)=>{
		// console.log("room-controller 107 ", room.rawLink);
		// console.log(user.name);

		var userInstance = {
			id  : user.id,
			name: user.name
		};

		room.onlineUsers.push(userInstance);
		room.usersCount++;
		room.save((err)=>{
			if(err){reject(err);}
			// console.log(`added ${userInstance.name} to ${room.rawLink}`);
			resolve(room);
		});
	});
}


// Removes a user object from room.onlineUsers
// Slows down the application. Should be updated (updated).
// A query must be made to the database, because the application
// 		failed to exit two users consecutively from any room.
Controller.removeOnlineUser = function(user, room){
	return new Promise((resolve, reject)=>{
		if(!room.onlineUsers || !user.id){
			console.log("Removing user - 130");
			console.log(user);
			console.log(room);
			reject(new Error("No user or room supplied"));
		}
		console.log(room.id);

		Room.findOne({_id: room.id}, (err, roomInstance)=>{
			if(err){
				throw err;
			}
			// console.log("room instance: ", roomInstance);
			var index = locateUserIndex(roomInstance.onlineUsers, user.id);
			if(index != -1){
				// No user is in the room.
				// Causes the users count to appear as -1 when using mlab mongodb
				if(roomInstance.usersCount <= 0){
					return;
				}
				roomInstance.onlineUsers.splice(index, 1);
				roomInstance.usersCount--;
				// console.log("removing from room ", roomInstance);
				roomInstance.save((err)=>{
					if(err){
						// throw err;
						console.log("Failed to save 144");
						console.log(err);
						reject(err);
					}
					resolve(roomInstance);
				});
			}
		});
	});
}

// Activiates a single room, after a user enters it.
// Increases the usersCount  +1, and inserts the userId in the onlineUsers[]
// Instead of searching the database, a username and a user-id can be sent,
// however; this ensures that any room's onlineUsers are members in the database.
Controller.enterRoom = function(user, room){
	console.log(`rawLink (enterRoom) ${room.rawLink}`);
	console.log(`userId (enterRoom) ${user.id}`);

	return new Promise((resolve, reject)=>{
		if(!room.onlineUsers){
			reject(new Error("No room found"));
		}
		// Searches the array of online users.
		var userIndex = locateUserIndex(room.onlineUsers, user.id);

		// If the user is already not in this room, add the user.
		if(userIndex == -1){
			// Add the user to the list (asynchronous).
			Controller.addOnlineUser(user, room)
			.then((room)=>{
				// console.log("room-controller 168");
				resolve(room);
			}).catch((err)=>{
				// console.log("room-controller 171 - faild");
				reject(err);
			});
		}		
	});
}

// Converted it to a promise, for some functionality in socket-evnets.js
// Removes the user from the room, and sets the usersCount -1
Controller.exitRoom = function(user, room){
	console.log(`rawLink(exitRoom) ${room.rawLink}`);
	console.log(`user.id (exitRoom) ${user.id}`);

	return new Promise((resolve, reject)=>{
		if(!room){
			reject("No room found");
		}
		Controller.removeOnlineUser(user, room)
		.then((room)=>{
			if(room){
				resolve(room);
			}else{
				reject(false);
			}
		}).catch((err)=>{
			reject(err);
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
		// usersList[] = {id, name}
		if(usersList[i].id.equals(userId)){
			index = i;
			return index;
		}
	}
	return index;
}

module.exports = Controller;