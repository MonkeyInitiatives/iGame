// This is middleware for restricting routes a user is not allowed to visit if not logged in
module.exports = function (req, res, next) {
  // If the user is logged in, continue with the request to the restricted route
  if (req.user) {
    return next();
  }
  // If the user isn't logged in, redirect them to the login page
  req.flash("error_msg", "Please log in to view that resource");
  return res.redirect("/");
};