const express = require("express");
const mongoose = require("mongoose");
const shortid = require("shortid");
var geoip = require('geoip-lite');
const publicIp = require('public-ip');

var privateIpValue;
var publicIpValue;
var geoLocValue;
var geoLocValuePrivate;
var browserAndOSValue;

//middlewares
const auth = require("../../middlewares/auth.js");
const validator = require("../../middlewares/validator.js");
const encrypt = require("../../libs/encrypt.js");

const router = express.Router();

const visitorModel = mongoose.model("visitor");

module.exports.controller = function(app) {
  //route for signup
  router.get("/visitorsignup", auth.loggedIn, function(req, res) {
   // router.get("/visitorsignup", function(req, res) {
    
    privateIpValue = getClientPrivateIp(req);
    var promiseResolve = Promise.resolve(getClientPublicIp);
    promiseResolve.then(function(value) {
      publicIpValue = value;
      var geo = geoip.lookup(value);
      geoLocValue = geo;
    });
    browserAndOSValue = req.useragent;

    // var privateIpbreak = privateIpValue.substring(0, privateIpValue.indexOf(","));
    // geoLocValuePrivate = geoip.lookup(privateIpbreak);
    geoLocValuePrivate = [];
    

    res.render("visitorsignup", {
      title: "Visitor Signup",
      user: req.session.user,
      chat: req.session.chat
    });


  });

  //api to create new user
  router.post("/api/v1/signup", function( req, res) {
    
     const today = Date.now();
     const id = shortid.generate();

    // //create user.
     const newVisitor = new visitorModel({
        visitor_id: id,
        visitor_name: req.body.visitor_name,
        visitor_email: req.body.visitor_email,
        phone_number: req.body.phone_number,
        company_name: req.body.company_name,
        number_of_employees: req.body.number_of_employees,
        visitor_publicIp: publicIpValue,
        visitor_privateIp: privateIpValue,
        visitor_region_publicIp: geoLocValue,
        visitor_region_privateIp: geoLocValuePrivate,
        visitor_browser_and_os: browserAndOSValue,
        createdOn: today,
        updatedOn: today
     });

     newVisitor.save(function(err, result) {
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
         res.redirect("/chat");
       }
     });
  });

  //route for logout
  router.get("/visitorlogout", function(req, res) {
    delete req.session.user;
    res.redirect("/visitor/visitorsignup");
  });


  app.use("/visitor", router);
}; //signup controller end


var getClientPrivateIp = function(req) {
  var ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (!ipAddress) {
    return '';
  }// convert from "::ffff:192.0.0.1"  to "192.0.0.1"
  if (ipAddress.substr(0, 7) == "::ffff:") {
    ipAddress = ipAddress.substr(7)
  }return ipAddress;
};

var getClientPublicIp = (async () => {
  var pIp = await publicIp.v4();
  return pIp;
})();
