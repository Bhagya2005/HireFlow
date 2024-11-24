const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizModel");

router.post("/addQuiz", async (req, res) => {
  const { userId, jobRole, que, a, b, c, d, ans } = req.body;

  try {
    // Create a new quiz document directly
    const newQuiz = new Quiz({
      user: userId,
      jobRole,
      que,
      a,
      b,
      c,
      d,
      ans,
    });

    // Save the new quiz document
    await newQuiz.save();
    res.status(201).send("Quiz added successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong from backend");
  }
});

module.exports = router;
