let Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  let Game = sequelize.define("Game", {
    name: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    hypes: DataTypes.INTEGER,
    summary: DataTypes.TEXT,
    poster: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  Game.associate = function(models) {
    Game.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Game;
};