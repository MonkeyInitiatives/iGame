let Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  let Games = sequelize.define("Games", {
    name: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    hypes: DataTypes.INTEGER,
    summary: DataTypes.STRING,
    poster: {
      type: DataTypes.STRING,
      allowNull: false
    },
  });
  Games.associate = function(models) {
    Games.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Games;
};