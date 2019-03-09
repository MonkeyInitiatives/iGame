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
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "./images/default-avatar.png"
        },
        backgroundimage: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: "./images/default-background.png"
        },
        accentcolor: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "white"
        }
    });
    User.associate = function (models) {
        User.hasMany(models.Game, {
          onDelete: "cascade"
        });
        User.hasMany(models.Friend, {
        onDelete: "cascade"
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