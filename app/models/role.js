const mongoose = require("mongoose");
const shortid = require("shortid");
const Schema = mongoose.Schema;
const roleSchema = new Schema({
  role_id: { type: String, default: "", required: true },
  role_name: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("Role", roleSchema);

const roleModel = mongoose.model("Role", roleSchema);


const newRole = new roleModel({
  role_id: shortid.generate(),
  role_name: 'agent',
  createdOn: Date.now()
});

const newRole2 = new roleModel({
  role_id: shortid.generate(),
  role_name: 'visitor',
  createdOn: Date.now()
});

roleModel.findOne(
  { $and: [{ role_name: 'agent' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newRole.save();
    } 
  }
);

roleModel.findOne(
  { $and: [{ role_name: 'visitor' }] },
  function(err, result) {
    if (result == null || result == undefined || result == "") {
      newRole2.save();
    } 
  }
);
