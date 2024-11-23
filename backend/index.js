const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "multipart/form-data"],
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Database Connected ");
  })
  .catch((err) => console.error("Database Connection Failed: ", err));

const User = require("./models/userModel");

const signup = require("./routes/signup");
const login = require("./routes/login");

app.use(signup);
app.use(login);

app.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post("/signup", signup);
app.post("/login", login);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
