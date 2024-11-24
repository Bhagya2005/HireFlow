const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const dayjs = require("dayjs");

router.post("/updateUser", async (req, res) => {
  const { userId, date, startTime, endTime, name, companyName, email, jobrole } =
    req.body;

    console.log("backend data :  " + userId, date, startTime, endTime, name, companyName, email);
    

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Format the date to "YYYY-MM-DD" for MongoDB
    if (date) user.date = date;

    if (name) user.name = name;
    if (companyName) user.companyName = companyName;
    if(jobrole) user.jobRole = jobrole

    // Convert startTime and endTime to Date objects
    if (startTime) user.startTime = startTime; // Convert to Date
    if (endTime) user.endTime = endTime; // Convert to Date

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
