const express = require("express");
const router = express.Router();
const Tech = require("../models/techModel");

router.post("/addTech", async (req, res) => {
  const { problems } = req.body; // Accepting an array of problems (tech topics)

  try {
    // Map incoming problems to the appropriate format
    const techEntries = problems.map((problem) => ({
      user: null, // Optional, set to `null` unless user is provided
      title: problem.title,
      desc: problem.desc,
    }));

    // Insert all the tech entries into the database
    const savedTechEntries = await Tech.insertMany(techEntries);

    res.status(201).json({ success: true, techEntries: savedTechEntries });
  } catch (err) {
    console.error("Error saving tech entries:", err);
    res.status(500).send("Something went wrong while adding tech entries.");
  }
});

module.exports = router;
