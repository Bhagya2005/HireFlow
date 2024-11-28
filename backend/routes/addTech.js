const express = require("express");
const router = express.Router();

router.post("/addTech", async (req, res) => {
  console.log("Add tech");
});

module.exports = router;
