const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth.js");

module.exports.controller = function(app) {
  //route for chat
  app.get("/chat", auth.checkLogin, function(req, res) {
    if(req.session.user == undefined){
      res.redirect("visitor/visitorsignup");
      // res.status(404).json({
      //   success: false,
      //   message: "user session expires"
      // });
    }
    res.render("chat", {
      title: "Chat Home",
      user: req.session.user,
      chat: req.session.chat
    });
    // res.status(200).json({
    //   success: true,
    //   user: req.session.user,
    //   chat: req.session.chat
    // });
  });

  app.use(router);
}; //Chat controller end.
