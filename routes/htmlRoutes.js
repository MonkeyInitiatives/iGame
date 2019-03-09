let db = require("../models");
let express = require("express");
let router = express.Router();
let path = require("path");

// Requiring our custom middleware for checking if a user is logged in
let isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function (app) {


  // Load library page and fills in game objects from database for specific user.
  app.get("/library", function (req, res) {
    if (!req.user) {
      res.redirect("/")
    } else {
      db.Game.findAll({
        where: {
          UserId: req.user.id
        }
      }).then((data) => {
        // let hbsObject = {
        //   games: data,
        //   user: [{
        //     userID: req.user.id,
        //     userName: req.user.name,
        //     email: req.user.email,
        //     avatar: req.user.avatar,
        //     backgroundimage: req.user.backgroundimage,
        //     accentcolor: req.user.accentcolor
        //   }]
        // }
        db.User.findAll({
          where: {
            id: req.user.id
          }
        }).then((userdata) => {
          let hbsObject = {
               games: data,
               user: userdata
          };
          res.render("index", hbsObject);
        });
        
      });
    }
  });

  // Load login page unless user already signed in
  app.get("/login", function (req, res) {
    // If the user already has an account
    if (req.user) {
      res.redirect("/library");
    }
    else{
      res.render("login");
    }
  });

  // Load signup unless logged in already
  app.get("/signup", function (req, res) {
    if (req.user) {
      res.redirect("/library");
    }
    else{
      res.render("signup");
    }
  });

  // Load welcome/start page or library if user is logged in
  app.get("/", (req, res) => {
    if (req.user) {
      res.redirect("/library");
    }
    else{
      res.render("welcome");
    }
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