
require('dotenv').config()
var axios = require("axios");
let bodyparser = require('body-parser');
let db = require("../models");

module.exports = function (app) {
  // Get all games
  app.get("/api/games", (req, res) => {
    db.Game.findAll({}).then((dbGames) => {
      res.json(dbGames);
    });
  });

  // Post route for user login
  // app.post("/login", (req, res) => {
  //   db.User.findOne({
  //     where: {
  //       username: req.body.username
  //     }
  //   }).then((dbUser) => {
  //     res.json(dbUser);
  //   })
  // });

  app.post("/api/games", (req, res) => {
      db.Game.create({
        game: req.params.game,
        queryUrl: "https://api-v3.igdb.com/games" + game,
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'user-key': process.env.IGDB_KEY
        },
        data: "name, imageUrl, rating, summary"
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.error(err);
    });
  });

  //I did another api route different from the one above that searches the aidb api for a game, returning an object of names and summaries
  app.post("/api/search/:title", (req, res) => {
    console.log(req.params.title);

    axios.get("https://api-v3.igdb.com/games/?search="+req.params.title+"&fields=name,summary&limit=5", {
      headers: {
        "user-key": process.env.IGDB_KEY,
        "Accept": "application/json"
      }
    })
    .then(response => {
      // Do work here
      console.log(JSON.stringify(response.data));
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
};