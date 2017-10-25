var socket = io.connect();
socket.emit("referrer", window.location.href);

socket.on("user-join", function(userName){

});

socket.on("message", function(message){

});
