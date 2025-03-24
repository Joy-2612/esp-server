// server-ws.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = process.env.PORT || 3000;

// Use express.json() and enable CORS
app.use(express.json());
app.use(cors());

// lastMotionState is initially "No Motion Detected"
let lastMotionState = "No Motion Detected";

// (Optional) If you're no longer using HTTP POST from Arduino, you can remove this
app.post("/motion", (req, res) => {
  console.log("Motion data received (POST):", req.body);
  if (req.body.motion) {
    lastMotionState = req.body.motion;
    broadcast(lastMotionState);
  }
  res.sendStatus(200);
});

// Simple test route
app.get("/", (req, res) => {
  res.send("Hello from Motion Server with WebSockets!");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// When a client (Arduino or UI) connects via WebSocket
wss.on("connection", (ws) => {
  console.log("A client connected via WebSocket");

  // Immediately send the current state
  ws.send(lastMotionState);

  // **Listen for messages** from this client
  ws.on("message", (msg) => {
    console.log("Received message from client:", msg);

    // Update our global motion state
    lastMotionState = msg.toString();

    // Broadcast to all connected clients
    broadcast(lastMotionState);
  });

  ws.on("close", () => {
    console.log("A client disconnected");
  });
});

// Helper function to broadcast data to all WebSocket clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Start the server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
