var router     = require("express").Router();
var middleware = require("../middleware/middleware.js");

var isLoggedIn = middleware.isLoggedIn;

router.get(/^\/$|^\/home$|^\/index$/, isLoggedIn, function(req, res){
	res.render("user/index");
});

router.get("/profile", isLoggedIn, function(req, res){
	res.render("user/profile");
});

router.get("/rooms", isLoggedIn, function(req, res){
	res.render("user/rooms");
});

router.get("/logout", isLoggedIn, function(req, res){
	req.logout();
	req.session = null;
	res.redirect("/");
});


module.exports = router;