// connectionSocket.emit("room-link", window.location.href);

// Chat room url:
var link = window.location.href.match(/.*\/(.*)/)[1];

// var socket = io.connect("/" + link);
var socket = io.connect("/");
socket.emit("link", link);
console.log("connected to " + link);

// Will trigger a "users-list" emission from the server.
// To get a list of all connected users.
socket.emit("new-user");


// A list of all connected users.
socket.on("users-list", function(usersList){
	console.log("users list: ");
	console.log(usersList);
});

// A user has sent a message
socket.on("message", function(message){
	console.log("message event: ");
	console.log(message)
});
