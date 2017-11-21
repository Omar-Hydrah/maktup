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

// userEmail is from the session.
// username, password, email are from the update form.
Controller.updateUser = function(userEmail, username, email, password){
	return new Promise((resolve, reject)=>{

		/*User.findOneAndUpdate({email: user.email}, updatedUser, (err, doc)=>{
			if(err){return res.send("Failed to update.");}
			console.log(doc);
			return res.send("Updated user " + user.id);
		});*/
		/*User.update({email: user.email}, {$set: updatedUser}, (err, doc)=>{
			if(err){return res.send("Failed to update.");}
			console.log(doc);
			return res.send("Updated user " + user.id);
		});*/
		
		// Because null values can exist, The user must be found first,
		// to use its old attributes instead of saving "null" to database.
		User.findOne({email: userEmail}, (err, user)=>{
			if(err){
				// console.log("Did not find user: ", err);
				reject(err);
				return;
			}

			user.name     = (username == null) ? user.name : username;
			user.email    = (email    == null) ? user.email: email;		
			user.password = (password == null) ? 
				user.password : User.hashPassword(password);

			console.log("user-controller ", user.id);
			user.save((err, user)=>{
				// 11000 for duplicate emails.
				if(err && err.code && err.code == "11000"){
					// console.log("Code error", err.code);
					// Promises don't reject with two variables.
					reject(err);
					return;
				}else if(err){
					// general error. 
					reject(err);
					return;
				}
				// console.log("updated user ", user);
				resolve(user);
			});
		});
	});
}

// Stores user data in session (id, username, email)
Controller.storeInSession = function(request, user){
	request.session.user       = {};
	request.session.user.id    = user.id;
	request.session.user.name  = user.name
	request.session.user.email = user.email;
}



// Takes an ObjectId array, and returns usernames array.
/*Controller.getUsersById = function(list){
	var usersList = [];

	for(var i = 0; i < list.length; i++){
		// User.findById(list[i], )
	}
}*/

module.exports = Controller;
