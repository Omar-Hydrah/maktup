var Helpers = {};

Helpers.isValidEmail = function(email){
	// this regex is copied from an online source.
	// var match = email.match("[^\\.\\s@][^\\s@]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*");

	// Working regex:
	var match = email.match(/[A-Za-z0-9\.]+@[\w.]+\.[A-Za-z0-9\.]?/);
	if(match == null){
		return false;
	}else{
		return true;
	}
}

Helpers.jsonRespond = function(response){
	return JSON.stringify(response);
}

Helpers.validateUsername = function(username){
	if(username != null && username.length < 4){
		return false;

	// User didn't want to change this value
	}else if(username == null){
		return true;
	}else{
		return false; // Invalid.
	}
}

Helpers.validateEmail    = function(email){

	if(email != null && email.length > 0 && Helpers.isValidEmail(email)){
		return true;
	// User didn't want to change this value
	}else if(email == null){
		return true;
	}else{
		return false; // Invalid
	}
}

Helpers.validatePassword = function(password){
	if(password != null && password.length < 4){
		return false;

	// User didn't want to change this value
	}else if(password == null){
		return true;
	}
}

Helpers.validateForm = function(username, email, password){
	var errors = [];
	if(!Helpers.validateUsername(username)){
		errors.push("Username must be more than 4 characters");
	}
	if(!Helpers.validateEmail(email)){
		errors.push("Invalid email");
	}
	if(!Helpers.validatePassword(password)){
		errors.push("Password must be at least 4 characters");
	}

	return errors;
}

// Removes any html tags from the passed string
Helpers.stripTags = function(string){
	// (.*)<(.*)>(.*)<\/\2>(.*)
	return string.replace(/(.*)<.*>(.*)<\/.*>(.*)/, "$1$2$3");
}

module.exports = Helpers;
