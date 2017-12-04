var async          = require("async");
var RoomController = require("./controllers/room-controller.js");

// Session is not included with the namespace

// When assigning events to namespaces, from the database, 
// 		newly created rooms aren't registered.

module.exports = function(io, sharedSession, sessionSetup){
/*


// Broadcasts a list of online users. 
// To be displayed as a "connected users" list in room view
// Emitted whenever there's a connect or a disconnect.
function emitUsersList(namespace, rawLink){
	console.log(rawLink);
	RoomController.getRoomOnlineUsers(rawLink)
	.then((onlineUsers)=>{
		var usersList = onlineUsers.map((item)=>{
			return item.name;
		});
		namespace.emit("users-list", usersList);
	}).catch((err)=>{
		console.log(err);
	});
}
*/

// Events must be defined under io (general)
io.on("connection", (socket)=>{
	var room;
	var user; // From the session object

	socket.on("disconnect", ()=>{
		if(!user || !room){
			console.log("Ambiguous disconnection");
			return;
		}
		RoomController.exitRoom(user, room)
		.then((roomInstance)=>{
			room = roomInstance;
		}).catch((err)=>{
			console.log(err);
		});
	});	

	// User submitted a link, to be connected to a room.
	socket.on("link", (link)=>{
		
		user = socket.handshake.session.user;

		// No user registered in the session
		if(!user){
			delete user;
			console.log("Unauthenticated access to " + link);
			return;
		}

		// Validate that the room is a valid room.
		RoomController.getRoomByLink(link)
		.then((roomInstance)=>{
			room = roomInstance;
			console.log("socket-event.js 149 ", room.rawLink);

			socket.join(room.rawLink, ()=>{
				console.log(room.rawLink, " opened");
				// console.log(socket.rooms);
				// var userObject = {id: user.id, name: user.name};

				RoomController.enterRoom(user, room)
				.then(()=>{
					console.log("Added user successfully");
					// To prevent the user from instantly 
					// 		firing off a new-user 'event'.
					// Helps in havin the server first find the room.
					socket.emit("joined-successfully");
				}).catch((err)=>{
					console.log(err);
				});
			})
		}).catch((error)=>{
			// An authenticated user tried accessing a non-existent room.
			if(user.name){
				console.log(`Access to non-existent room ${link} from ${user.name}`);

			// Anonymous access
			}else{
				console.log(`Anonymous access to non-existent room ${link}`);
			}
		});	
	});

	// I'm not sure how the room is updated with new users
	// 		without a database call. 
	// Broadcast a list of all conneted users.
	socket.on("new-user", ()=>{
		if(!room || !room.rawLink){
			console.log("No room was set - 87");
			return;
		}
		var usersList = room.onlineUsers.map((user)=>{
			return user.name;
		});

		io.to(room.rawLink).emit("users-list", usersList);
	});

	// Broadcast the message to all users.
	socket.on("message", (message)=>{
		if(!user){
			console.log("Anonymous tried to send message - 100");
			return;
		}
		if(!room){
			console.log("Message sent to vacum");
		}

		console.log(`${message} came to ${room.rawLink}`);

		var messageObject = {
			sender: user.name,
			content: message 
		};
		io.to(room.rawLink).emit("message", messageObject);
	});
});
}