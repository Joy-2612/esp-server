// index.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 3000;

// Create an HTTP server and bind Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Use express.json() to parse JSON bodies
app.use(express.json());

// Enable CORS so your mobile app can connect
app.use(cors());

// Global variable to store the last motion state
let lastMotionState = "No Motion Detected";

// Define a route to receive motion data (POST)
app.post("/motion", (req, res) => {
  console.log("Motion data received:", req.body);
  if (req.body.motion) {
    lastMotionState = req.body.motion;
    // Broadcast the new state to all connected clients
    io.emit("motion", lastMotionState);
  }
  res.sendStatus(200);
});

// A simple GET route to test the server
app.get("/", (req, res) => {
  res.send("Hello from Motion Server!");
});

// (Optional) A GET endpoint to check the last motion status in JSON
app.get("/status", (req, res) => {
  res.json({ motion: lastMotionState });
});

// Handle new WebSocket connections
io.on("connection", (socket) => {
  console.log("A client connected via Socket.IO");

  // Optionally send the current state immediately upon connection
  socket.emit("motion", lastMotionState);

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Start listening
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
