const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/updateUser", async (req, res) => {
  const {
    userId,
    date,
    startTime,
    endTime,
    name,
    companyName,
    email,
    jobrole,
    passingMarks,
    userEmail,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Update user details
    if (date) user.date = date;
    if (name) user.name = name;
    if (companyName) user.companyName = companyName;
    if (jobrole) user.jobRole = jobrole;
    if (passingMarks) user.aptitudePassingMarks = passingMarks;
    if (startTime) user.startTime = startTime;
    if (endTime) user.endTime = endTime;

    // Check if passingMarks are set and if score meets/exceeds the passingMarks
    if (passingMarks && user.aptitudePassingMarks <= passingMarks) {
      if (!user.aptitudePassesCandidates.includes(userEmail)) {
        user.aptitudePassesCandidates.push(userEmail); // Add email to passed candidates
      }
    } else {
      user.aptitudeFailedCandidates.push(userEmail); // Add email to failed candidates
    }
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).send("Email already exists");
      }
      user.email = email;
    }

    await user.save();

    res.status(200).send("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
