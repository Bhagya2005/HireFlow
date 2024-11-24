const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  date: {
    type: Date,
    default: Date,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
});

module.exports = mongoose.model("User", userSchema);
