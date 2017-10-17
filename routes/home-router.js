var router = require("express").Router();

router.get("/", function(req, res){
	res.render("index");
});

router.post("/register", function(req, res){
	console.log(req.body);
	res.redirect("/user");
});

router.post("/login", function(req, res){
	console.log(req.body);
	res.redirect("/user/");
});

/*router.get("/home", function(req, res){
	res.render("home");
});

router.get("/profile", function(req, res){
	res.render("profile");
});

router.get("/rooms", function(req, res){
	res.render('rooms');
});
*/
module.exports = router;