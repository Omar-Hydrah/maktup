var RoomController = require("./controllers/room-controller.js");

module.exports = function(io){

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
				/*console.log("sock-events.js(19)");
				console.log(room);
				console.log(socket.handshake.session.user.username);
				console.log(socket.handshake.session.user.id);*/
				
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

}