const express = require("express");
const router = express.Router();
require("dotenv").config();

const addOnPrompt = `
Generate an aptitude quiz with 10 questions. Each question should have:
- A question text.
- 4 options labeled A, B, C, and D.
- The correct answer.
Return the quiz as an array of objects in JSON format, where each object contains:
{
  "question": "Question text",
  "options": { "A": "Option A", "B": "Option B", "C": "Option C", "D": "Option D" },
  "answer": "A" // or B, C, D
}
`;

router.get("/generateQuiz", async (req, res) => {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(addOnPrompt);
    const rawResponse = await result.response.text(); // Get the raw response text

    // Remove potential extra characters (like backticks or spaces)
    const cleanedResponse = rawResponse.slice(7, -4).trim();

    // Log cleaned response
    console.log("Cleaned Response:", cleanedResponse);

    // Parse JSON
    const responseText = JSON.parse(cleanedResponse);

    console.log("Parsed Response:", responseText);
    res.status(200).json(responseText); // Send the parsed JSON to the frontend
  } catch (error) {
    console.error("Error generating quiz:", error);
    res.status(500).send("Failed to generate quiz");
  }
});

module.exports = router;
