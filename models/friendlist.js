let Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  let Friend = sequelize.define("Friend", {
    status: DataTypes.STRING,
    requestName: DataTypes.STRING,
    requestID: DataTypes.INTEGER,
    FriendName: DataTypes.STRING
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