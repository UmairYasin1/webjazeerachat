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
  router.get("/agentlogin", function(req, res) {
    res.render("agentlogin", {
      title: "Agent Login",
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/agentsignup", function(req, res) {
    res.render("agentsignup", {
      title: "Agent Signup",
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/dashboard", function(req, res) {
    if(req.session.user == undefined){
      res.redirect("agentlogin");
    }
    else{
      res.render("agentDashboard", {
        title: "Agent Dashboard",
        user: req.session.user,
        chat: req.session.chat
      });
    }
  });

  //route for login
  router.post("/api/v1/login",  function(req, res) {
    
    const epass = encrypt.encryptPassword(req.body.password);
    agentModel.findOne(
      { $and: [{ agent_email: req.body.email }, { agent_password: epass }] },
      function(err, result) {
        if (err) {

          res.json("1");

        } else if (result == null || result == undefined || result == "") {

        res.json("2");

        } else {
           req.user = result;
           delete req.user.password;
           req.session.user = result;
           delete req.session.user.password;
           res.json("3");
        }
      }
    );
  });

  //api to create new user
  router.post("/api/v1/signup", function( req, res) {
    
    const today = Date.now();
    const id = shortid.generate();
    const epass = encrypt.encryptPassword(req.body.password);

   // //create user.
    const newAgent = new agentModel({
        agent_id: id,
        agent_name: req.body.agent_name.replace(/\s/g, ''),
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
        console.log("Error " + err);
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

  router.get("/allagents", function(req, res) {
    res.render("allagentsList", {
      title: "Agents List",
      user: req.session.user,
      chat: req.session.chat
    });
  });

  router.get("/agentlogout", function(req, res) {
    delete req.session.user;
    delete req.session.chat;
    res.redirect("/agent/agentlogin");
  });

  app.use("/agent", router);
}; //signup controller end
