
require('dotenv').config()
let bodyparser = require('body-parser');
let db = require("../models");

module.exports = function (app) {
  // Get all games
  app.get("/api/games", (req, res) => {
    db.Games.findAll({}).then((dbGames) => {
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
      db.Games.create({
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

  // Delete games
  app.delete("/api/games/delete/:id", function (req, res) {
    db.Games.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.redirect("/");
    });
  });
};