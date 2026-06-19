import express from "express";
// import "./logger";

const app = express();

// For json Data: Suppose client will send { "content-type": "application/json" }, we have to use this "express.json()" middleware otherwise it won't be works
app.use(express.json());

// FOR HTML FORM SUBMISSIONS: If your data comes from a standard HTML <form> submit action
app.use(express.urlencoded({ extended: true }));

app.use("/cats", express.static("public/cats")); // Serve on "/cats/1.jpg"
app.use("/dogs", express.static("public/dogs")); // Serve on "/dogs/2.jpg"

// 👉 Serve on "http://localhost:port/1.jpg" -->  It will going to give "cats/1.jpg" because it's first that's why as it got it will send it.
// app.use(express.static("public/cats"));
// app.use(express.static("public/dogs"));

app.get("/", (req, res) => {
  //   res.redirect("https://www.google.com"); // 👉 Send response to redirect to the given website
  //   res.download(path.resolve(__dirname, "../public/cats/1.jpg")); 👉 Send to browser to download the file
  //   res.json({ message: "Thanks for coming to localhost:4000 route" });

  // --> Send any kind of data
  //   res.send({ message: "Thanks for coming to localhost:4000 route" });
  //   res.send("<h1>Hello world</h1>");

  res.status(200).json({ message: "Hello world" });
});

import BirdRouter from "./routes/bird";
import FileRouter from "./routes/file";
import MiddlewareRouter from "./middleware/middleware";

app.use("/file", FileRouter);
app.use("/bird/:home", BirdRouter);
app.use("/middleware", MiddlewareRouter);

app.listen(3000, () => console.log("Server is running on port 3000"));
