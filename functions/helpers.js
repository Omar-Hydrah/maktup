var Helpers = {};

Helpers.isValidEmail = function(email){
	// this regex is copied from an online source.
	// var match = email.match("[^\\.\\s@][^\\s@]*(?!\\.)@[^\\.\\s@]+(?:\\.[^\\.\\s@]+)*");
	var match = email.match(/[A-Za-z0-9\.]+@[\w.]+\.[A-Za-z0-9\.]?/);
	if(match == null){
		return false;
	}else{
		return true;
	}
}

module.exports = Helpers;