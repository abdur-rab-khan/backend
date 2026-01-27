const express = require("express");

const app = express();
const port = 3000;

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api_2" });
});

// Example GET endpoint
app.get("/api/message", (req, res) => {
  res.json({ message: "Hello from API 2!" });
});

// Example POST endpoint
app.post("/api/echo", (req, res) => {
  res.json({ received: req.body });
});

app.listen(port, () => {
  console.log(`API 2 listening at http://localhost:${port}`);
});
