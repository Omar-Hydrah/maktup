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


app.set("view engine", "ejs");
app.use(express.static(path.resolve(__dirname, "public")));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser("happyflappycat"));

/* Login and authentication middlewares */
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


/* Express Routers */
var homeRouter = require("./routes/home-router.js");
var userRouter = require("./routes/user-router.js");

app.use("/", homeRouter);
app.use("/user", userRouter);


var port = process.env.PORT || 80;

server.listen(port, function(){
	console.log(`Maktup is running on port ${port}`);
});