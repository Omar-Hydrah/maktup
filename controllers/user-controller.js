var User = require("../models/user-model.js");

var Controller = {};

Controller.findUserById = function(userId){
	return new Promise((resolve, reject)=>{
		User.findById(userId, (err, userInstance)=>{
			if(err){reject(err);}

			resolve(userInstance);
		});
	});
}

// Takes an ObjectId array, and returns usernames array.
/*Controller.getUsersById = function(list){
	var usersList = [];

	for(var i = 0; i < list.length; i++){
		// User.findById(list[i], )
	}
}*/

module.exports = Controller;