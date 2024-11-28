const express = require("express");
const router = express.Router();
const Tech = require("../models/techModel"); // Replace with actual path to your tech model

router.get("/getTech", async (req, res) => {
  const { userId } = req.query;
  console.log("get techhh.....");

  try {
    let techItems;

    if (userId) {
      // If userId is provided, filter tech items by userId
      techItems = await Tech.find({ user: userId });
    } else {
      // If userId is not provided, return all tech items
      techItems = await Tech.find();
    }

    const modifiedTechItems = techItems.map((tech) => {
      tech.id = tech._id;
      return tech;
    });

    console.log(modifiedTechItems);

    res.status(200).json(modifiedTechItems);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong from backend");
  }
});

module.exports = router;
