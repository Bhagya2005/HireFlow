const mongoose = require("mongoose");

const eachQuizSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  que: { type: String, required: true },
  a: { type: String, required: true },
  b: { type: String, required: true },
  c: { type: String, required: true },
  d: { type: String, required: true },
  ans: { type: String, required: true },
});

const quizSchema = new mongoose.Schema([eachQuizSchema]);

module.exports = mongoose.model("Quiz", quizSchema);
