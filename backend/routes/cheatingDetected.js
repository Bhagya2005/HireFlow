const express = require("express");
const router = express.Router();
const User = require("./path-to-your-model/userModel"); // Adjust the path to your user model

// Route to handle cheating detection
router.post("/cheatingDetected", async (req, res) => {
  const { email, comment, cheatImage } = req.body;

  console.log(req.body);

  if (!email || !comment) {
    return res.status(400).json({ message: "Email and comment are required." });
  }

  try {
    // Find the user by email in candidateData
    const user = await User.findOne({ "candidateData.email": email });

    if (!user) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    // Update the specific candidate's data in candidateData
    const candidate = user.candidateData.find(
      (candidate) => candidate.email === email
    );

    if (candidate) {
      candidate.cheatComment = comment;
      candidate.cheatImage = cheatImage || candidate.cheatImage; // Update image if provided
    } else {
      return res.status(404).json({ message: "Candidate data not found." });
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "Cheating details updated successfully." });
  } catch (error) {
    console.error("Error updating cheating details:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;
