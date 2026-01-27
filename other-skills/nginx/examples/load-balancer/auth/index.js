const express = require("express");

const app = express();
const PORT = 3000;

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth" });
});

app.get("/auth", (req, res, next) => {
  const isAuthenticated = Math.random() > 0.5;
  if (isAuthenticated) {
    req.user = { id: Math.floor(Math.random() * 1000), name: "RandomUser" };
    res.status(200).json({ message: "Authenticated", user: req.user });
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
