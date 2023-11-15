// MERN = MongoDB + Express + React + Nodejs.

// Development = Nodejs server + React server.

// Production = Nodejs server + static react files.

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// connecting with db
mongoose.connect("mongodb://localhost:27017/full-mern-stack-video");

// using cors
app.use(cors());
// converting values to json
app.use(express.json());

// register service
app.post("/api/register", async (req, res) => {
  // Hashing password
  let newPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: "ok" });
  } catch {
    res.json({ status: "error", error: "Duplicate email" });
  }
});

// login service
app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  // Compare and checking the user password and with hashed password
  let isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
  if (user && isPasswordCorrect) {
    // Encoding the jwt token
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    res.json({ status: "ok", user: token });
  } else {
    res.json({ status: "error", user: false });
  }
});

// pouplate quotes service
app.post("/api/quotes", async (req, res) => {
  const accessToken = req.headers["x-access-token"];
  // decoding the jwt token
  const decode = jwt.verify(accessToken, "secret123");
  try {
    const user = await User.findOne({
      email: decode.email,
    });
    if (user) {
      res.json({ status: "ok", quote: user.quote });
    } else {
      res.json({ status: "error", error: "Invalid token" });
    }
  } catch {
    res.json({ status: "error", error: "Invalid token" });
  }
});

// listening to port
app.listen(1337, () => {
  console.log("==========Server Startd at 1337==========");
});
