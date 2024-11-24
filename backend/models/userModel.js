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
  jobRole: {
    type: String,
  },
  date: {
    type: String,
    default: Date,
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  }
});

module.exports = mongoose.model("User", userSchema);
