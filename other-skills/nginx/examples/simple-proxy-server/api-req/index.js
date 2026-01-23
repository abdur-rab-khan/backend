const express = require("express");

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  const SERVER_NAME = process.env.SERVER_NAME || "API Request Server";

  res.json({
    message: "Hello from the API request server!" + ` (${SERVER_NAME})`,
    timestamp: new Date().toISOString(),
  });
});

app.post("/data", (req, res) => {
  res.json({
    receivedData: req.body,
    message: "Data received successfully!",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`API request server is running on http://localhost:${PORT}`);
});
