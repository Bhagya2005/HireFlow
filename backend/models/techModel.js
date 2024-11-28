const mongoose = require("mongoose");

const eachTechSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: { type: String, required: true },
  desc: { type: String, required: true },
});

const techSchema = new mongoose.Schema([eachTechSchema]);

// Use a different model name, like "Tech"
module.exports = mongoose.models.Tech || mongoose.model("Tech", techSchema);
