const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizModel");

router.post("/addQuiz", async (req, res) => {
  const { userId, que, a, b, c, d, ans } = req.body;

  try {
    const newQuiz = new Quiz({
      user: userId || "",
      que,
      a,
      b,
      c,
      d,
      ans,
    });

    await newQuiz.save();
    res.status(201).send("Quiz added successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong from backend");
  }
});

module.exports = router;
