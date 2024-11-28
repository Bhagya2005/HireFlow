const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizModel");

router.post("/addQuiz", async (req, res) => {
  const { userId, questions } = req.body; // Accepting questions as an array

  console.log("Received userId and questions:", userId, questions);

  try {
    // Mapping the incoming questions to the appropriate format
    const quizzesToSave = questions.map((quiz) => ({
      user: null, // Optional: You can leave it empty or handle it accordingly
      que: quiz.que,
      a: quiz.a,
      b: quiz.b,
      c: quiz.c,
      d: quiz.d,
      ans: quiz.ans,
    }));

    // Insert all the quizzes into the database
    const savedQuizzes = await Quiz.insertMany(quizzesToSave);

    res.status(201).json({ success: true, quizzes: savedQuizzes });
  } catch (err) {
    console.error("Error saving quizzes:", err);
    res.status(500).send("Something went wrong while adding quizzes.");
  }
});

module.exports = router;
