let Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  let Friend = sequelize.define("Friend", {
    status: DataTypes.STRING,
    friendID: DataTypes.INTEGER
  });
  
  Friend.associate = function (models) {
    // Associating user with Game
    // When a User is deleted, also delete any associated Game
    Friend.belongsTo(models.User, {
        foreignKey: {
            allowNull: false
        }
    });
};
  return Friend;
};