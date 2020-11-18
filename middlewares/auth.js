const mongoose = require("mongoose");

module.exports.checkLogin = function(req, res, next) {
  if (!req.user && !req.session.user) {
    // console.log(req.user);
    // console.log(req.session.user);
    //res.redirect("/visitor/visitorsignup");
    res.status(404).json({
      success: false,
      message: "user session expires"
    });
  } else {

    // req.session.user = req.session.user;
    // req.chat = req.session.chat;
    // next();
    res.status(200).json({
      success: true,
      user: req.session.user,
      chat: req.session.chat
    });
  }
};

module.exports.loggedIn = function(req, res, next) {
  if (!req.user && !req.session.user) {
    next();
  } else {
    // res.redirect("/chat");
    res.status(200).json({
      success: true,
      user: req.session.user,
      chat: req.session.chat
    });
  }
};
