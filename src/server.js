const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const http = require("http");
const WebSocket = require("ws");
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import and use routes
app.use("/src/auth", require("./routes/authRoutes"));
app.use("/src/users", require("./routes/userRoutes"));
app.use("/src/matches", require("./routes/matchRoutes"));
app.use("/src/messages", require("./routes/messageRoutes"));
app.use("/src/settings", require("./routes/settingsRoutes"));

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  console.log("New client connected");
  const params = new URLSearchParams(req.url.replace("/?", ""));
  ws.userId = params.get("userId");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

module.exports = { app, wss };
