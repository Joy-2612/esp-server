// index.js
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Use express.json() to parse JSON bodies
app.use(express.json());

// Enable CORS so your mobile app can fetch data
app.use(cors());

// Global variable to store the last motion state
let lastMotionState = "No Motion Detected";

// Define a route to receive motion data (POST)
app.post("/motion", (req, res) => {
  console.log("Motion data received:", req.body);
  if (req.body.motion) {
    lastMotionState = req.body.motion;
  }
  res.sendStatus(200);
});

// A simple GET route to test the server
app.get("/", (req, res) => {
  res.send("Hello from Motion Server!");
});

// Define a GET endpoint to return the last motion status as JSON
app.get("/status", (req, res) => {
  res.json({ motion: lastMotionState });
});

// Start listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
