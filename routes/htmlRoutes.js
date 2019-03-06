let db = require("../models");
let express = require("express");
let router = express.Router();
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {

  // Load home page
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