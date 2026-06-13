import os from "node:os";
import http from "node:http";

const getLocalIPv4 = () => {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];

    if (!networkInterface) {
      continue;
    }

    for (const networkAddress of networkInterface) {
      if (networkAddress.family === "IPv4" && !networkAddress.internal) {
        return networkAddress.address;
      }
    }
  }

  return "No local ipv4 found";
};

const sleep = (sleepTime: number) =>
  new Promise((resolve) => setTimeout(() => resolve(""), sleepTime));

const handleBase = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  res.statusCode = 200;
  res.statusMessage = "I'm Done man";
  res.write("Start......");
  await sleep(1000);
  res.end("End........");
};

const handleEcho = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  res.statusCode = 200;
  req.statusMessage += "Ok";

  res.write("ping................");
  await sleep(1000);
  res.write("pong................");
  await sleep(1000);

  res.end("..........ended.........");
};

const handlePostRoute = async (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  let body = "";

  req
    .on("data", (chunk) => {
      body += chunk;
    })
    .on("end", () => {
      if (!body) {
        res.statusCode = 401;
        res.statusMessage = "BODY_REQUIRED";
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: "Body is required", status: "failed" }),
        );
      } else {
        res.statusCode = 201;
        res.statusMessage = "SUCCESS";

        const parsedBody = JSON.parse(body);
        if ("name" in parsedBody) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ message: `Hello! ${parsedBody.name}` }));
        } else {
          res.end(body);
        }
      }
    });
};

const handleRoute = (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage>,
) => {
  switch (req?.url) {
    case "/":
      handleBase(req, res);
      break;
    case "/echo":
      handleEcho(req, res);
      break;
    case "/post":
      handlePostRoute(req, res);
      break;
    default:
      res.statusCode = 404;
      res.end("Not Found");
  }
};

const server = http.createServer((req, res) => {
  handleRoute(req, res);
});

const PORT = 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server is listening on ${PORT} -- http://localhost:${8080} | http://${getLocalIPv4()}:${PORT}`,
  );
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server is gracefully shutdown");
    process.exit(0);
  });
});
