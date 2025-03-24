// server-ws.js
const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const port = process.env.PORT || 3000;

// Use express.json() to parse JSON bodies and enable CORS
app.use(express.json());
app.use(cors());

let lastMotionState = "No Motion Detected";

// POST route to receive motion data from the ESP8266
app.post("/motion", (req, res) => {
  console.log("Motion data received:", req.body);
  if (req.body.motion) {
    lastMotionState = req.body.motion;
    // Broadcast to all connected WebSocket clients
    broadcast(lastMotionState);
  }
  res.sendStatus(200);
});

// A simple GET route to test the server
app.get("/", (req, res) => {
  res.send("Hello from Motion Server with WebSockets!");
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// When a new client connects, send the current state immediately.
wss.on("connection", (ws) => {
  console.log("A client connected via WebSocket");
  ws.send(lastMotionState);
  ws.on("close", () => {
    console.log("A client disconnected");
  });
});

// Broadcast function to send data to all connected clients.
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
