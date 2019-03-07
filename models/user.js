// Requiring bcrypt for password hashing.
let bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
    let User = sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        }
        // avatar: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        // background: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // },
        // color: {
        //     type: DataTypes.STRING,
        //     allowNull: false
        // }
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

    // checking if password is valid
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    // generate hook method, hash password before user is created
    User.hook("beforeCreate", function (user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });
    return User;
};