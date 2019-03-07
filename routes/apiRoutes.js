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
  app.get("/welcome", function (req, res) {
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
    let {
      name,
      email,
      password,
      password2
    } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) {
      errors.push({
        msg: "Please enter all fields"
      });
    }
    if (password != password2) {
      errors.push({
        msg: "Passwords don't match"
      })
    }
    if (errors.length > 0) {
      res.render("signup", {
        errors,
        name,
        email,
        password,
        password2
      });
    } else {
      db.User.findOne({
        where: {
          email: email
        }
      }).then(db.User, function () {
        if (db.User) {
          errors.push({
            msg: "Email alredy exists"
          });
          res.render("signup", {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered for iGame!"
                  );
                  res.render("/api/games");
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

  // Login
  app.post("/login", (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true
    })(req, res, next);
  });

  // Logout
  app.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.render("/welcome");
  });

  // ==============================================================================
  // GAMES ========================================================================
  // ==============================================================================
  // app.get("/api/games", function (req, res) {
  //   res.render("index");
  // });

  // Get all games
  app.get("/api/games", (req, res) => {
    // res.render("index");
    db.Game.findAll({}).then((dbGames) => {
      res.json(dbGames);
    });
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