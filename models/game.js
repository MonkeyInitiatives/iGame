let Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  let Game = sequelize.define("Game", {
    name: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    hypes: DataTypes.INTEGER,
    summary: DataTypes.TEXT,
    slug: DataTypes.STRING,
    poster: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  
  Game.associate = function (models) {
    // Associating user with Game
    // When a User is deleted, also delete any associated Game
    Game.belongsTo(models.User, {
        foreignKey: {
            allowNull: false
        }
    });
};
  return Game;
};