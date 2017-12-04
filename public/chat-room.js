// connectionSocket.emit("room-link", window.location.href);

// Chat room url (to join rooms):
var link = window.location.href.match(/.*\/(.*)/)[1];
var submitButton; // To send messages.
var textarea; // message area 
var messagesContainer; // All sent messages.
var usersContainer; // A list of connected users.
var beepSound; // sound to be played when a message comes.


// window.title will be changed when a new message comes, and use is not focused.
var documentTitle;
// Switch, to notify the user of new messages.
var unreadMessage = false; 
// When the message is viewed, the window title will go back to normal.
var messageViewed = true;
// User is not viewing the page.
var windowBlurred = false;

// var socket = io.connect("/" + link);
var socket = io.connect("/");
socket.emit("link", link);
console.log("connected to " + link);


socket.on("joined-successfully", function(){
	// Will trigger a "users-list" emission from the server.
	// To get a list of all connected users.
	socket.emit("new-user");	
});

// A list of all connected users.
socket.on("users-list", function(usersList){
	console.log("users list: ");
	console.log(usersList);
	createUsersList(usersContainer, usersList);
});

// A user has sent a message
socket.on("message", function(message){
	console.log("message event: ");
	console.log(message);

	writeMessage(messagesContainer, message);
	if(windowBlurred){
		beepSound.play();
		document.title = "Maktup - new message!";
		messageViewed  = false;
	}else{
		console.log("Message viewed");
	}
});

function writeMessage(container, messageObject){
	container.append(
		"<p><a href='#'>"+ messageObject.sender + "</a>: " 
		+ messageObject.content +"</p>"
	);
	// To scroll to the last message
	container.scrollTop(container.prop("scrollHeight"));
}

function createUsersList(usersContainer, usersList){
	usersContainer.children().remove();
	usersList.map(function(user){
		usersContainer.append(
			"<li><a href='#'>"+ user +"</a></li>"
		);
	});
}

function emitMessage(textarea){
	if(!textarea.val().trim()){
		return;
	}
	socket.emit("message", textarea.val().trim());
	textarea.val("");
}

// User switched back to page. All messages are read.
// Window title should be changed back to original.
window.onfocus = function(){
	// To prevent having an undefined documentTitle.
	// This event seems to be triggered before document.ready
	if(windowBlurred){
		messageViewed = true;
		windowBlurred = false;
		document.title = documentTitle;
	}
}

window.onblur = function(){
	windowBlurred = true;
}

$(document).ready(function(){

// To get a list of connected users, and append them to usersContainer.
socket.emit("new-user");

submitButton      = $("#submit-button");
textarea          = $("#textarea");
messagesContainer = $("#messages-container");
usersContainer    = $("#users-container");
beepSound         = document.getElementById("beep-sound");
console.log("document title: ", document.title);
documentTitle     = document.title;

textarea.on("keypress", function(event){
	// console.log(event.keyCode);
	if(event.keyCode == 13 && !event.shiftKey){
		// console.log("Enter clicked");
		emitMessage(textarea);
		event.preventDefault();
	}
});


submitButton.on("click", function(){
	// socket.emit("message", textarea.val().trim());
	// textarea.val("");
	emitMessage(textarea);
});

});