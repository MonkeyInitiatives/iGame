let db = require("../models");
let express = require("express");
let router = express.Router();
var path = require("path");

module.exports = function (app) {

  // Load home page
  app.get("/", (req, res) => {
    db.Games.findAll({}).then((data) => {
      let hbsObject = {
        games: data
      }
      res.render("index", hbsObject);
    });
  });

  // Load games 
  app.get("/api/games", (req, res) => {
    connection.sync().then(() => {
      db.Games.findAll({
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