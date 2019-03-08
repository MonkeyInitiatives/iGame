require("dotenv").config()
let axios = require("axios");
let express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
let bodyparser = require("body-parser");
let db = require("../models");
let passport = require("../config/passport");
// let passport = require("passport");

module.exports = function (app) {

  // =============================================================================
  // USERS =======================================================================
  // =============================================================================

  // Welcome Page
  app.get("/", function (req, res) {
    res.render("welcome");
  });

  // Login Page
  app.get("/login", function (req, res) {
    res.render("login");
  });

  // Signup Page 
  app.get("/signup", function (req, res) {
    res.render("signup");
  });

  // Signup 
  app.post("/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }).then(function(){
      console.log("here?");
      res.redirect("/login");
    });
    
  });

  // Login
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/library");
  });

  // Logout
  app.get("/logout", (req, res) => {
    req.logout();
    // req.flash("success_msg", "You are logged out");
    res.render("welcome");
  });

  // ==============================================================================
  // GAMES ========================================================================
  // ==============================================================================
  // app.get("/api/games", function (req, res) {
  //   res.render("index");
  // });

  // Get all games
  // app.get("/api/games", (req, res) => {
  //   // res.render("index");
  //   db.Game.findAll({}).then((dbGames) => {
  //     res.json(dbGames);
  //   });
  // });

  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/games", (req, res) => {
    db.Game.create({
        game: req.params.game,
        queryUrl: "https://api-v3.igdb.com/games" + game,
        method: "POST",
        headers: {
          "Accept": "application/json",
          "user-key": "14bcc6458a18cfd1b0d77df55ddc0f97"
        },
        data: "name, imageUrl, rating, summary"
      })
      .then(response => {
        // console.log(response.data);
      })
      .catch(err => {
        console.error(err);
      });
  });

  //I did another api route different from the one above that searches the aidb api for a game, returning an object of names and summaries
  app.post("/api/search/:title", (req, res) => {
    axios.get("https://api-v3.igdb.com/games/?search=" + req.params.title + "&fields=name,summary&limit=5", {
        headers: {
          "user-key": "14bcc6458a18cfd1b0d77df55ddc0f97",
          "Accept": "application/json"
        }
      })
      .then(response => {
        // Do work here
        // res.json(response.data[0]);
        res.json(response.data);
      })
      .catch(e => {
        console.log("error", e);
      });
  });

  app.post("/api/searchTitle/:title", (req, res) => {
    axios.get("https://api-v3.igdb.com/games/" + req.params.title + "?fields=*", {

        headers: {
          "user-key": "14bcc6458a18cfd1b0d77df55ddc0f97",
          "Accept": "application/json"
        }
      })
      .then(response => {
        // Do work here
        // res.json(response.data[0]);
        // console.log(response.data[0].cover);

        var newGame = {
          name: response.data[0].name,
          rating: response.data[0].rating,
          slug: response.data[0].slug,
          poster: "http://www.writingfordesigners.com/wp-content/uploads/2016/12/Doom.jpg",
          hypes: response.data[0].popularity,
          summary: response.data[0].summary,
          UserId: req.user.id
        }
        axios.get("https://api-v3.igdb.com/covers/" + response.data[0].cover + "?fields=*", {
            headers: {
              "user-key": "14bcc6458a18cfd1b0d77df55ddc0f97",
              "Accept": "application/json"
            },
            data: "fields alpha_channel,animated,game,height,image_id,url,width;"
          })
          .then(response => {
            // console.log(response.data);
            newGame.poster = "http:" + response.data[0].url;
            newGame.poster = newGame.poster.replace("t_thumb", "t_cover_big");
            db.Game.create(newGame).then(function (cb) {
              res.json(cb);
            });
          });
      })
      .catch(e => {
        console.log("error", e);
      });
  });

  // Delete games
  app.delete("/api/games/delete/:id", function (req, res) {
    db.Game.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.redirect("/");
    });
  });
}