const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");

//middlewares
const auth = require("../../middlewares/auth.js");
const validator = require("../../middlewares/validator.js");
const encrypt = require("../../libs/encrypt.js");

const router = express.Router();

const agentModel = mongoose.model("agent");

module.exports.controller = function(app) {
  //route for signup
  router.get("/agentsignup", function(req, res) {
    res.render("agentsignup", {
      title: "Agent Signup",
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/dashboard", function(req, res) {
    res.render("agentDashboard", {
      title: "Agent Dashboard",
      user: req.session.user,
      chat: req.session.chat
    });
  });

  //api to create new user
  router.post("/api/v1/signup", function( req, res) {
    
    const today = Date.now();
    const id = shortid.generate();
    const epass = encrypt.encryptPassword(req.body.password);

   // //create user.
    const newAgent = new agentModel({
        agent_id: id,
        agent_name: req.body.agent_name,
        agent_email: req.body.agent_email,
        agent_phone: req.body.phone_number,
        agent_password: epass,
        agent_status: '1',
        agent_ip: today,
        createdOn: today,
        updatedOn: today
    });

    newAgent.save(function(err, result) {
      if (err) {
        console.log(err);
        res.render("message", {
          title: "Error",
          msg: "Some Error Occured During Creation.",
          status: 500,
          error: err,
          user: req.session.user,
          chat: req.session.chat
        });
      } else if (result == undefined || result == null || result == "") {
        res.render("message", {
          title: "Empty",
          msg: "User Is Not Created. Please Try Again.",
          status: 404,
          error: "",
          user: req.session.user,
          chat: req.session.chat
        });
      } else {
        req.user = result;
        req.session.user = result;
        res.redirect("/agent/dashboard");
      }
    });

  });

  app.use("/agent", router);
}; //signup controller end
