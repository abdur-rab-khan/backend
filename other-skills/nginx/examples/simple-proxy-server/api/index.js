const express = require("express");

const app = express();
const PORT = 3000;

app.use((req, res) => {
  const serverName = process.env.SERVER_NAME || "Unknown Server";
  res.send("Hello from the simple proxy server!" + ` (${serverName})`);
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
