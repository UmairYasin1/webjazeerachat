const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const chatSchema = new Schema({
  msgFrom: { type: String, default: "", required: true },
  msgTo: { type: String, default: "" },
  msg: { type: String, default: "", required: true },
  file: { type: String, default: "",},
  room: { type: String, default: "", required: true },
  createdOn: { type: Date, default: Date.now }
});

mongoose.model("Chat", chatSchema);
