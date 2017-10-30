var mongoose = require("mongoose");
var bcrypt   = require("bcrypt-nodejs");
var Room     = require("./room-model.js");
var ObjectId = mongoose.SchemaTypes.ObjectId;
var RoomSchema = Room.schema;


// userSchema.rooms types, should be replaced with RoomSchema
var userSchema = mongoose.Schema({
	email:{type:String, required:true},
	name: {type: String, required:true},
	password: {type: String},
	rooms: [{roomId: ObjectId}],
	roomsCount: {type: Number}
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

userSchema.methods.createUser = function(email, name, password){
	this.email      = email;
	this.name       = name;
	this.password   = hashPassword(password);
	this.roomsCount = 0;
	return this;
}


module.exports = mongoose.model("User", userSchema);