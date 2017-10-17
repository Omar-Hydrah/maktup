var kasba = require("kasba");

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect("/");
	}
}

function storeToken(req, res, next){
	var hashToken = kasba.createHash(15);
	req.session.token = hashToken;
	res.cookie("token", hashToken, {
		httpOnly:true,
		maxAge: 24 * 60 * 60 * 1000,
		signed: true
	});

	return next();
}

module.exports = {
	isLoggedIn: isLoggedIn,
	storeToken: storeToken
};