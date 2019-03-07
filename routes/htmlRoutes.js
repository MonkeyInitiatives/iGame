let db = require("../models");
let express = require("express");
let router = express.Router();
let path = require("path");

// Requiring our custom middleware for checking if a user is logged in
let isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  app.get("/welcome", function (req, res) {
    res.render("welcome");
  });

  app.get("/login", function (req, res) {
    // If the user already has an account
    if (req.user) {
      res.render("index");
    }
  });

  // app.get("/", function(req,res) {
  //   res.render("index")
  // })

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  // app.get("/api/games", isAuthenticated, function (req, res) {
  //   res.render("/api/games", {
  //     user: req.user
  //   });
  // });

  // Load Game Page
  // Took out "isAuthenticated," for some reason, it wasn't grabbing the 
  app.get("/", (req, res) => {
    db.Game.findAll({}).then((data) => {
      let hbsObject = {
        games: data
      }
      res.render("index", hbsObject);
    });
  });

  // Load games 
  app.get("/api/games", (req, res) => {
    connection.sync().then(() => {
      db.Game.findAll({
        attributes: ["name", "imageUrl", "rating", "summary"]
      }).then((data) => {
        let hbsObject = {
          games: data
        }
        res.render("games", hbsObject);
      });
    })
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};