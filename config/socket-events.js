module.exports = function(io){

io.on("connection", (socket)=>{

	socket.on("disconnect", ()=>{
		console.log("disconnected");
	});

	socket.on("room-name", (roomName)=>{
		console.log(roomName);
	});
});	

}