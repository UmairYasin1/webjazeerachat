const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const userModel = mongoose.model("User");

module.exports.controller = function(app) {
  //router for home.
  router.get("/", function(req, res) {
    res.redirect("/agent/agentsignup");
  });

  app.use(router);
}; //home controller end.
