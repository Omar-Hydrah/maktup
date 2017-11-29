var path       = require("path");
var express    = require("express");
var app        = express();
var server     = require("http").Server(app);
// var io         = require("socket.io")(server);
var io         = require("socket.io")();
var session    = require("express-session");
var flash      = require("connect-flash");
var passport   = require("passport");
var mongoose   = require("mongoose");
var morgan     = require("morgan");
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
app.use(morgan("dev"));

var sessionStore = new session.MemoryStore();

var sessionSetup = session({
	secret: "cathappysuper",
	resave: true,
	saveUninitialized: true,
	store: sessionStore
});

app.use(sessionSetup);

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
// Applying a general authentication middleware, 
// to avoid writing it in every single route.
app.use("/user", middleware.isLoggedIn, userRouter);
app.use("/rooms", middleware.isLoggedIn, roomRouter);

// The remaining routes don't exist. 
app.get("*", function(req, res){
	res.render("error");
});

var port = process.env.PORT || 80;

io.attach(server, {
	pingInterval: 10000,
	pingTimeout: 5000,
	cookie: false
});

// Shares the server session with the sockets server.
io.use(sharedSession(sessionSetup));

// Socket server events
// sharedSession must be applied to all of the namespaces.
// require("./socket-events.js")(io, sharedSession, sessionSetup);
require("./socket-events.js")(io);

server.listen(port, function(){
	console.log(`Maktup is running on port ${port}`);
});