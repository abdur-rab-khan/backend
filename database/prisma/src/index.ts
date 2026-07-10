import http from "http";
import "dotenv/config";
import { createPost, createUser } from "./db/create";
import { getPosts, getUserById } from "./db/query";


const server = http.createServer(async (req, res) => {
  const rawPath = new URL(
    req?.url || "",
    `http://${req?.headers.host || "localhost"}`,
  );

  const method = req?.method || "GET";
  const path = rawPath?.pathname || "/";
  const query = Object.fromEntries(rawPath?.searchParams.entries() || []);

  const validURL = path && path !== "/" && path !== "/not-found";

  try {
    if (validURL) {
      if (method === "POST") {
        if (path === "/user") {
          const user = await createUser();
          res
            .writeHead(200, { "Content-Type": "application/json" })
            .end(JSON.stringify(user));
        } else if (path === "/post") {
          const post = await createPost(query?.userId);
          res
            .writeHead(200, { "Content-Type": "application/json" })
            .end(JSON.stringify(post));
        }
      } else if (method === "GET") {
        if (path === "/user") {
          const users = await getUserById(query?.userId);
          res
            .writeHead(200, { "Content-Type": "application/json" })
            .end(JSON.stringify(users));
        } else if (path === "/post") {
          const posts = await getPosts(query?.userId);
          res
            .writeHead(200, { "Content-Type": "application/json" })
            .end(JSON.stringify(posts));
        }
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" }).end("404 Not Found");
    }
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" }).end(String(error?.message ?? "An unknown error occurred while processing your request"));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
