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
	var rawLink;
	var user; // From the session object

	socket.on("disconnect", ()=>{
		if(!user || !rawLink){
			return;
		}
		RoomController.exitRoom(user.id, rawLink);
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
		.then((room)=>{
			rawLink = link;
			console.log("socket-event.js 149 ", rawLink);
			console.log(room.rawLink);
		}).catch((error)=>{
			// An authenticated user tried accessing a non-existent room.
			if(user.name){
				console.log(`Access to non-existent room ${link} from ${user.name}`);

			// Anonymous access
			}else{
				console.log(`Anonymous access to non-existent room ${link}`);
			}
			// delete rawLink;
			// return;
		});	
		if(!rawLink){
			return;
		}
		console.log("About to join " + rawLink);
		socket.join(rawLink, ()=>{
			console.log(rawLink, " opened");
			// console.log(socket.rooms);
			RoomController.enterRoom(user.id, rawLink)
			.then(()=>{
				console.log("Added user successfully");
			}).catch((err)=>{
				console.log(err);
			});
		});
	});

	// Broadcast a list of all conneted users.
	socket.on("new-user", ()=>{
		RoomController.getRoomOnlineUsers(rawLink)
		.then((onlineUsers)=>{	
			var usersList = onlineUsers.map((user)=>{
				return user.name
			});
			console.log("users list: ", usersList);
			console.log(rawLink);
			io.to(rawLink).emit("users-list", usersList);			
		}).catch((error)=>{
			console.log(error);			
		})
	});

	// Broadcast the message to all users.
	socket.on("message", (message)=>{
		console.log(`${message} came to ${rawLink}`);
		io.to(rawLink).emit("message", message);
	});
});
}