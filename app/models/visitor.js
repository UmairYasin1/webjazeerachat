const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const visitorSchema = new Schema({
  visitor_id: { type: String, default: "", required: true },
  visitor_name: { type: String, default: "", required: true },
  visitor_email: { type: String, default: "", required: true },
  phone_number: { type: String, default: "", required: true },
  company_name: { type: String, default: "", required: true },
  number_of_employees: { type: String, default: "", required: true },
  visitor_publicIp: { type: String, default: "" },
  visitor_privateIp: { type: String, default: "" },
  visitor_region: [],
  visitor_browser_and_os: [],
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now }
});
mongoose.model("visitor", visitorSchema);
