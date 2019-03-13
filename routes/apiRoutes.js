require("dotenv").config()
let axios = require("axios");
let express = require("express");
let router = express.Router();
let bcrypt = require("bcryptjs");
let bodyparser = require("body-parser");
let db = require("../models");
let passport = require("../config/passport");

module.exports = function (app) {

  /*

  User login and signup routes

  */

  // Signup 
  app.post("/signup", function (req, res) {
    // console.log(req.body);
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      // console.log("here?");
      res.redirect("/login");
    });

  });

  // Login
  app.post("/api/login", passport.authenticate("local", {
    // successRedirect: "/library",
    failureRedirect: "/login",
    failureFlash: true
  }), function(req, res) {
    res.json("/");
  })
  
  // , function (req, res) {
  //   res.json("/");
  // });

  // Logout
  app.get("/logout", (req, res) => {
    req.logout();
    res.render("welcome");
  });

  // Update a user's avatar, backgroundimage, and accent color.
  app.post("/api/update_user", (req, res) => {
    db.User.update({
      avatar: req.body.avatar,
      backgroundimage: req.body.backgroundimage,
      accentcolor: req.body.accentcolor
    }, {
      where: {
        id: req.user.id
      }
    }).then(function () {
      res.render("index");
    });

  });
  app.post("/api/friends/library", function (req, res) {
    console.log(req.body.friendID);
    db.Game.findAll({
      where: {
        UserId: req.body.friendID
      }
    }).then((data) => {
      res.json(data);
    });
  });


  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  /*

  GAME LIBRARY AND DATABASE ROUTES

  */

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

  //Searches for 5 titles in api. Perhaps show/get more than name, summary?
  app.post("/api/search/:title", (req, res) => {
    axios.get("https://api-v3.igdb.com/games/?search=" + req.params.title + "&fields=name,summary&limit=5", {
        headers: {
          "user-key": "14bcc6458a18cfd1b0d77df55ddc0f97",
          "Accept": "application/json"
        }
      })
      .then(response => {

        res.json(response.data);
      })
      .catch(e => {
        console.log("error", e);
      });
  });

  //searches for a specific game and adds to user library
  //TODO; make sure text has no quotations when adding to name or summary
  app.post("/api/searchTitle/:title", (req, res) => {
    axios.get("https://api-v3.igdb.com/games/" + req.params.title + "?fields=*", {

        headers: {
          "user-key": "14bcc6458a18cfd1b0d77df55ddc0f97",
          "Accept": "application/json"
        }
      })
      .then(response => {
        var newGame = {
          name: response.data[0].name,
          rating: response.data[0].aggregated_rating,
          slug: response.data[0].slug,
          poster: "http://www.writingfordesigners.com/wp-content/uploads/2016/12/Doom.jpg",
          hypes: response.data[0].popularity,
          summary: response.data[0].summary,
          releasedate: response.data[0].first_release_date,
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

  app.get("/api/friends/", function (req, res) {
    db.Friend.findAll({
        where: {
          friendID: req.user.id
        }
      }).then(response => {
        // console.log(response.data);
        res.json(response);
      })
      .catch(err => {
        console.error(err);
      });
  });

  app.post("/api/friends/add/", function (req, res) {
    console.log(req.body.userID);
    console.log(req.body.requestID);
    db.Friend.update({
      status: 'accepted'
    }, {
      where: {
        requestID: req.body.requestID,
        userId: req.body.userID
      },
    }).then(() => {
      db.Friend.create({
          status: "accepted",
          requestID: req.user.id,
          UserId: req.body.requestID,
          FriendName: req.body.requestName,
          requestName: req.user.name
        }).then(response2 => {
          res.json("/library");
          // console.log(response2.data);
          // console.log(response.data);
        })
        .catch(err => {
          console.error(err);
        });
    });
  });
  app.post("/api/friends/reject/", function (req, res) {
    console.log(req.body.requestID);
    db.Friend.destroy({
      where: {
        requestID: req.body.requestID,
        userId: req.body.userID
      }
    }).then(response => {
      res.json("/library");
    });
  });

  app.post("/api/friends/:email", function (req, res) {
    console.log("Starting post");
    db.User.findAll({
        where: {
          email: req.params.email
        }
      }).then(response => {
        // console.log(response[0].dataValues.id);
        db.Friend.create({
            status: "pending",
            requestID: req.user.id,
            UserId: response[0].dataValues.id,
            FriendName: response[0].dataValues.name,
            requestName: req.user.name
          }).then(response2 => {
            res.json("/library");
            // console.log(response2.data);
            // console.log(response.data);
          })
          .catch(err => {
            console.error(err);
          });
      })
      .catch(err => {
        console.error(err);
      });

  });

  // Delete games, not implemented right now.
  app.delete("/api/games/delete/:id", function (req, res) {
    db.Game.destroy({}).then(() => {
      res.redirect("/");
    });
  });
}