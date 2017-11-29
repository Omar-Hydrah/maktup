var async          = require("async");
var RoomController = require("./controllers/room-controller.js");

module.exports = function(io, sharedSession, sessionSetup){

// Split the sockets, to different namespaces.
// Session is not included with the namespace
// When using namespaces, newly created rooms aren't registered.
RoomController.getRooms()
.then((rooms)=>{

	for(var i = 0; i < rooms.length; i++){
		// To protect from local scopes.
		const rawLink = rooms[i].rawLink;
		console.log(rawLink);

		// Assigning sharedSession to read the session from the handshake
		io.of("/" + rawLink).use(sharedSession(sessionSetup, {
			autoSave: true
		}));

		// Assign events to every room.
		var namespace = io.of("/" + rawLink);


		namespace.on("connection", (socket)=>{
			// console.log("Socket id:");
			// console.log(socket.id);
			
			var user = socket.handshake.session.user;
			// console.log("user: ",  user);
			if(!user){
				// Unauthenticated access.
				console.log( "Unauthenticated connection to socket - ", 
					rawLink
				);
				return;
			}

			RoomController.enterRoom(user.id, rawLink);

			// Remove the user from the room's list of onlineUsers. 
			// socket.on("disconnect", handleDisconnect.bind(user.id, rawLink));
			socket.on("disconnect", ()=>{
				console.log(`${user.name} disconnected`);
				// Both of these operations are asynchronous:
				RoomController.exitRoom(user.id, rawLink)
				.then(()=>{
					emitUsersList(namespace, rawLink);
				}).catch((err)=>{
					console.log(err);
				});
				/*async.waterfall([
					function(callback){
						RoomController.exitRoom(user.id, rawLink);
						callback();
					},function(){
						emitUsersList(namespace, rawLink);						
					}
				]);*/
			});

			// New user has joined the chat room. 
			// A users' list must be broadcast.
			// room.onlineUsers is already set up properly, 
			// users are added instantly.
			// So we only need to fetch and then broadcast the list of online users.
			socket.on("new-user", ()=>{
				emitUsersList(namespace, rawLink);
			});

		});
	}

}).catch((err)=>{
	console.log(err);
});

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

// Events must be defined under io (general)
/*
// When a user socket disconnects
function handleDisconnect(userId, rawLink){
	if(!userId || !rawLink){
		console.log("User left - .34");
		return;
	}
	// console.log("userId: ", userId);
	// console.log("rawLink: ", rawLink);
	RoomController.exitRoom(userId, rawLink);	
	console.log(userId + " left the room. -59");
}

// When a user joins a room (socket connection) 
function handleUserJoin(userId, username, rawLink){
	if(!userId || !username || !rawLink){
		return;
	}
	console.log(`${username} joined`);
}

// When a user leaves the room. - Unuseful
function handleUserLeave(userId, username){

}*/

/*
io.on("connection", (socket)=>{
	var rawLink;
	var userId;

	socket.on("disconnect", ()=>{
		console.log("disconnected");
		// console.log(`Left ${rawLink}`);
		// Removes the userId from the list of the room's online users.
		// Decreases the room's usersCount by one.
		RoomController.exitRoom(userId, rawLink);
	});

	socket.on("room-link", (roomLink)=>{

		// console.log(roomLink);
		rawLink = roomLink.match(/.*\/(.*)/)[1];// The rawLink result
		userId  = socket.handshake.session.user.id; // The current user.

		// If the rawLink and the userId are effectively obtained.
		// To avoid any sudden errors.
		if(rawLink != "" && rawLink != null && userId != "" && userId != null ){

			RoomController.getRoomByLink(rawLink).then((room)=>{
				//console.log("sock-events.js(19)");
				//console.log(room);
				//console.log(socket.handshake.session.user.username);
				//console.log(socket.handshake.session.user.id);
				
				// Adds the userId to the room's list of online users.
				// Increases the room's usersCount by one.
				RoomController.enterRoom(userId, rawLink); 
				
				// Send an updated users' list to all users.
				// Filtering will be handled client side.
				RoomController.getRoomOnlineUsers(rawLink)
				.then((onlineUsers)=>{
					io.emit("users-list", {
						rawLink    : rawLink, 
						onlineUsers: onlineUsers
					});

				}).catch((err)=>{
					throw err;
				});

			}).catch((err)=>{
				throw err;
			});
			
		}
	});


});	

*/
}