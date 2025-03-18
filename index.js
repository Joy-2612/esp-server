// index.js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Use express.json() to parse JSON bodies
app.use(express.json());

// Define a route to receive motion data (POST)
app.post("/motion", (req, res) => {
  // Log the request body to see motion data
  console.log("Motion data received:", req.body);

  // Send back a success status
  res.sendStatus(200);
});

// A simple GET route to test
app.get("/", (req, res) => {
  res.send("Hello from Motion Server!");
});

// Start listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
