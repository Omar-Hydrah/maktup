var socket = io.connect();
var rawLink = window.location.href.match(/.*\/(.*)/)[1];

socket.emit("room-link", window.location.href);

socket.on("user-join", function(userName){

});

socket.on("users-list", function(data){
	console.log(data.rawLink);
	console.log(rawLink);
	if(data.rawLink == rawLink){
		console.log(data.onlineUsers);
	}
});

socket.on("message", function(message){

});
