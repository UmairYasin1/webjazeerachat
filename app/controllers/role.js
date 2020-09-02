const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const roleModel = mongoose.model("Role");

module.exports.controller = function(app) {
  
  router.get("/allroles", function(req, res) {
    roleModel.find({}, function(err, data) {
        res.render('allrolesList', {
            title: "Roles List",
            user: req.session.user,
            chat: req.session.chat,
            rolesList: data
        });
    });
  });

  app.use("/role", router);
}; //signup controller end
