const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api_2" });
});

// Simple GET endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to API 1!" });
});

// Example GET endpoint
app.get("/status", (req, res) => {
  res.json({ status: "API 1 is running" });
});

// Example POST endpoint
app.post("/echo", (req, res) => {
  res.json({ youSent: req.body });
});

app.listen(PORT, () => {
  console.log(`API 1 listening on port ${PORT}`);
});
