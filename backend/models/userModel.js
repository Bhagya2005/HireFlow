const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String },
  jobRole: { type: String },
  date: { type: String, default: Date },
  startTime: { type: String },
  endTime: { type: String },
  allAptitudes: {
    type: Array,
    default: [], // Array of tech problems directly
  },
  allTechProblems: {
    type: Array,
    default: [], // Array of tech problems directly
  },
});

// Use "User" as the model name
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
