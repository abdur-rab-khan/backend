import { Router } from "express";

const router = Router({ mergeParams: true }); // 👉 "mergeParams keyword", merges the parent route "path parameter", Actually by default if on root "app.use("/home/:fileId", router)", it won't give the access of "fileId" on sub-routes we have to make this option true.

router
  .get("/", (req, res) => {
    console.log(req.params);
    res.status(200).json({ message: "welcome to bird / route" });
  })
  .post("/", (_, res) =>
    res.status(201).json({ message: "Welcome to bird / post route" }),
  ); // It's possible to chain the same route with difference "HTTP METHODS"

router.get("/about", (req, res) => {
  console.log(req.params);
  res.status(200).json({ message: "welcome to bird /about route" });
});

export default router;
