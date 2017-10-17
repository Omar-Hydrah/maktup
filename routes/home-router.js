var router     = require("express").Router();
var passport   = require("passport");
var middleware = require("../middleware/middleware.js");


/* Passport authentication middleware */
var loginMiddleware = passport.authenticate("login", {
	failureRedirect:"/",
	successRedirect: "/user/",
	failureFlash: true
});

var registerMiddleware = passport.authenticate("register", {
	failureRedirect:"/",
	successRedirect: "/user/",
	failureFlash: true
});

router.get("/", function(req, res){
	var loginMessage    = req.flash("loginMessage");
	var registerMessage = req.flash("registerMessage");

	// Login and register failure messages.
	if(loginMessage.length){
		console.log(`login error: ${loginMessage}`);
	}
	if(registerMessage.length){
		console.log(`register error: ${registerMessage}`);
	}
	res.render("index");
});

router.post("/login", loginMiddleware, middleware.storeToken, function(req, res){
	req.session.username = req.user.username;
	res.redirect("/user/");
});

router.post("/register", registerMiddleware, middleware.storeToken, function(req, res){
	req.session.username = req.user.username;
	res.redirect("/user");
});




module.exports = router;