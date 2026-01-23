const express = require("express");

const app = express();
const PORT = 3000;

app.use((req, res) => {
  const serverName = process.env.HOSTNAME || "Unknown Server";

  res.send(`
    <h1>
      Hello from the simple proxy server! (${serverName})
    </h1>

    <h2>Request Headers:</h2>
      <table border="1">
        <tr>
        <th>Header Name</th>
        <th>Header Value</th>
        </tr>
        ${Object.entries(req.headers)
          .map(([key, value]) => `<tr><td>${key}</td><td>${value}</td></tr>`)
          .join("")}
      </table>
  `);
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
