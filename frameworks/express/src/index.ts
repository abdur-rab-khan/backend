import express from "express";
import path from "node:path";

const app = express();

app.use("/cats", express.static("public/cats")); // Serve on "/cats/1.jpg"
app.use("/dogs", express.static("public/dogs")); // Serve on "/dogs/2.jpg"

// 👉 Serve on "http://localhost:port/1.jpg" -->  It will going to give "cats/1.jpg" because it's first that's why as it got it will send it.
// app.use(express.static("public/cats"));
// app.use(express.static("public/dogs"));

app.get("/", (req, res) => {
  //   res.redirect("https://www.google.com");
  //   res.download(path.resolve(__dirname, "../public/cats/1.jpg"));
  //   res.json({ message: "Thanks for coming to localhost:4000 route" });

  // --> Send any kind of data
  //   res.send({ message: "Thanks for coming to localhost:4000 route" });
  //   res.send("<h1>Hello world</h1>");

  res.status(200).json({ message: "Hello world" });
});

import BirdRouter from "./routes/bird";
import FileRouter from "./routes/file";

app.use("/bird/:home", BirdRouter);
app.use("/file", FileRouter);

app.listen(3000, () => console.log("Server is running on port 3000"));
