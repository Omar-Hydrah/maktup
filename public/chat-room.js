// connectionSocket.emit("room-link", window.location.href);

// Chat room url:
var rawLink = window.location.href.match(/.*\/(.*)/)[1];

var socket = io.connect("/" + rawLink);
// Will trigger a "users-list" emission from the server.
// To get a list of all connected users.
socket.emit("new-user");

// usesless
socket.on("user-join", function(userName){

});

// A list of all connected users.
socket.on("users-list", function(usersList){
	// console.log(data.rawLink);
	// console.log(rawLink);
	/*if(data.rawLink == rawLink){
		console.log(data.onlineUsers);
	}*/
	console.log(usersList);
});

// A user has sent a message
socket.on("message", function(message){

});
