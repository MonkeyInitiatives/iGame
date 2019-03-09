let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;

// Load Models
let db = require("../models");

passport.use(new LocalStrategy({
        usernameField: "email"
    },
    function (email, password, done) {
        db.User.findOne({
            where: {
                email: email
            }
        }).then(function (dbUser) {
            if (!dbUser) {
                return done(null, false, {
                    message: "That email is not registered."
                });
            } else if (!dbUser.validPassword(password)) {
                return done(null, false, {
                    message: "Incorrect password."
                });
            }
            return done(null, dbUser);
        });
    }
));
passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

module.exports = passport;