require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");
var socket = require("socket.io");

// Passport config
var passport = require("./config/passport");

var db = require("./models");

// var app = express();
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3000;

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({
  extended: true
}));
app.use(require("express-session")({
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(express.static("public"));

// Socket setup
var io = socket(http);


io.on("connection", function (socket) {
  // testing connection
  console.log("\nmade socket connection. Socket ID: ", socket.id + "\n\n");

  socket.on("chat", function (data) {
    io.sockets.emit("chat", data);
    console.log("data: ", data)
  });
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });
});

// Handlebars
app.engine("handlebars", exphbs({
  defaultLayout: "main"
}));
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

var syncOptions = {
  force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function () {
  http.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;