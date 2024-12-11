const express = require("express");
const router = express.Router();
const Tech = require("../models/techModel");
const User = require("../models/userModel");

router.post("/addTech", async (req, res) => {
  const { problems, userId } = req.body; // Accepting an array of problems and userId

  try {
    // Map incoming problems to the appropriate format for the Tech model
    const techEntries = problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      desc: problem.desc,
    }));

    // Insert all the tech entries into the Tech model
    const savedTechEntries = await Tech.insertMany(techEntries);

    // Now, store the problems directly in the User model's `allTechProblems` array
    const techProblemData = savedTechEntries.map((entry) => ({
      id: entry._id.toString(),
      title: entry.title,
      desc: entry.desc,
    }));

    // Find the user and update their `allTechProblems` with the new tech problems
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { allTechProblems: { $each: techProblemData } } },
      { new: true } // Return the updated user
    );

    res.status(201).json({
      success: true,
      techEntries: savedTechEntries,
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error saving tech entries:", err);
    res.status(500).send("Something went wrong while adding tech entries.");
  }
});

module.exports = router;
