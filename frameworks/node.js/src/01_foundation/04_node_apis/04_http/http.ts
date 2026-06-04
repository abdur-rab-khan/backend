import http from "node:http";

const sleep = (time = 1000) =>
  new Promise((resolve) => setTimeout(() => resolve(""), 1000));

/*
 🟡 In node.js to create a simple "http" server we use --> "http.createServer" function, it accept one callback function that gives "Request" and "Response"
    🔷 "Request" --> It's a ReadableStream, So that we can use like a "node.stream" like we can use "pipes" etc
    🔷 "Response" --> It's a WritableStream, So that we can directly pass data through pipes.
 
 📥 Important methods and variables (REQUEST)
    1. Properties
        1. req.url
        2. req.method
        3. req.headers
   
    2. Stream Events
        1. req.on('data', cb)
        2. req.on('end', cb)
        2. req.on('error', cb)
        2. req.pip(dest)
 
 📤 Important methods and variables (RESPONSE)
    1. Properties
        1. res.statusCode = 200
        2. res.writeableEnded
        3. res.finished
        
    2. Header Methods
        1. res.setHeader(name, value);
        2. res.getHeader(name, value);
        3. res.removeHeader(name)
        4. res.writeHead(status, {})
 
    3. Body methods
        1. res.write(chuck) --> Used pass data as a chuck instead of passing everything at once, and it creates "Transfer-Encoding: chunked"
        2. res.end(data?) --> Used to pass everything at once, and it creates "Content-Length: content_size" header unlike "transform chunked"
*/
const { listen, addListener, getConnections, close } = http.createServer(
  (req, res) => {
    const { url, headers, method, pipe, socket } = req;
    const { remoteAddress } = socket; // Ip address of the client

    if (url && url === "/test") {
      let body: Buffer[] = [];

      req
        .on("data", (chuck) => {
          body.push(chuck);
        })
        .on("end", async () => {
          const parsedBody = Buffer.concat(body).toString();

          res.write("Just ready\n");
          await sleep(500);
          res.write("1\n");
          await sleep(1000);
          res.write("2\n");
          await sleep(1000);
          res.write("3\n");
          await sleep(1000);
          res.write("Here we go\n");
          await sleep(200);
          res.end(parsedBody);
        });
    } else if (url && url === "/get") {
      res.setHeader("body", '{"hello":"wow"}');
      res.end('{"hello":"wow"}');
    } else {
      res.statusCode = 404;
      req.pipe(res);
    }
  },
);

listen(8080, () => {
  console.log("Server is running on port 8080");
});

process.on("SIGTERM", () => {
  close(() => {
    console.log("Server is gracefully shutdown");
    process.exit(0);
  });
});
