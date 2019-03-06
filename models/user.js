module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        background: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    User.associate = function (models) {
        // Associating user with Game
        // When a User is deleted, also delete any associated Game
        User.belongsTo(models.Game, {
            foreignKey: {
              allowNull: false
            }
          });
    };
    return User;
};