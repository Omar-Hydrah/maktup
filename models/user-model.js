var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");

var userSchema = mongoose.Schema({
	email:{type:String, required:true},
	username: {type: String, required:true},
	password: {type: String}
});

function hashPassword(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.hashPassword = function(password){
	return hashPassword(password);
}

userSchema.methods.verifyPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

userSchema.methods.createUser = function(email, username, password){
	this.email    = email;
	this.username = username;
	this.password = hashPassword(password);

	return this;
}


module.exports = mongoose.model("User", userSchema);