// Backend code to handle tech problems with test cases

const express = require("express");
const router = express.Router();
const Tech = require("../models/techModel");
const User = require("../models/userModel");

// Route to add tech problems
router.post("/addTech", async (req, res) => {
  const { problems, userId } = req.body; // Accepting an array of problems and userId

  console.log("problems: ", problems);
  try {
    if (!Array.isArray(problems) || !userId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data provided." });
    }

    // Map incoming problems to the appropriate format for the Tech model
    const techEntries = problems.map((problem) => ({
      id: problem.id,
      title: problem.title,
      desc: problem.desc,
      testCases: problem.testCases || [], // Default to empty array if testCases is missing
    }));

    // Insert all the tech entries into the Tech model
    const savedTechEntries = await Tech.insertMany(techEntries);

    // Map the saved entries for the User model
    const techProblemData = savedTechEntries.map((entry) => ({
      id: entry._id.toString(),
      title: entry.title,
      desc: entry.desc,
      testCases: entry.testCases, // Pass testCases explicitly
    }));

    // Update the user with the new tech problems
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { allTechProblems: { $each: techProblemData } } },
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

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
