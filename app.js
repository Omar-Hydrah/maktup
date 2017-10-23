var path       = require("path");
var express    = require("express");
var app        = express();
var server     = require("http").Server(app);
var io         = require("socket.io")(server);
var session    = require("express-session");
var flash      = require("connect-flash");
var passport   = require("passport");
var mongoose   = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var sharedSession = require("express-socket.io-session");

try{
	// Remote host
	// mongoose.connect("mongodb://maktup_main:123456@ds121575.mlab.com:21575/maktup");
	mongoose.connect("mongodb://localhost:27017/maktup");
}catch(err){
	throw err;
}

app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser("happyflappycat"));

var sessionStore = new session.MemoryStore();

var sessionSetup = {
	secret: "cathappysuper",
	resave: true,
	saveUninitialized: true,
	store: sessionStore
};

app.use(session(sessionSetup));

/* Login and authentication middlewares */
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


/* Passport configuration */
require("./config/passport-config.js");

/* Express Routers */
var homeRouter = require("./routes/home-router.js");
var userRouter = require("./routes/user-router.js");
var roomRouter = require("./routes/room-router.js");

/* Custom middleware */
var middleware = require("./middleware/middleware.js");


app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/rooms", middleware.isLoggedIn, roomRouter);

var port = process.env.PORT || 80;

server.listen(port, function(){
	console.log(`Maktup is running on port ${port}`);
});