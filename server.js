require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");
// var flash = require("connect-flash");

// Passport config
var passport = require("./config/passport");

var db = require("./models");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("express-session")({ secret: "keyboard cat", resave: false, saveUninitialized: false }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// // Connect flash
// app.use(flash());

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
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
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;