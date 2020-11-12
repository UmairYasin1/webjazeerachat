const mongoose = require("mongoose");

module.exports.checkLogin = function(req, res, next) {
  if (!req.user && !req.session.user) {
    console.log(req.user);
    console.log(req.session.user);
    res.redirect("/visitor/visitorsignup");
  } else {
    next();
  }
};

module.exports.loggedIn = function(req, res, next) {
  if (!req.user && !req.session.user) {
    next();
  } else {
    res.redirect("/chat");
  }
};
