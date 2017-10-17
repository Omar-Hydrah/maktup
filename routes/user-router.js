var router = require("express").Router();

router.get(/\/|\/home|\/index/, function(req, res){
	res.render("user/index");
});



router.get("/profile", function(req, res){
	res.render("user/profile");
});

router.get("/rooms", function(req, res){
	res.render("user/rooms");
});


module.exports = router;