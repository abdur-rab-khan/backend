import { Router } from "express";

const router = Router();

router.use(
  (req, res, next) => {
    console.log("hello world");
    next();
  },
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    next();
  },
  (req, res, next) => {
    console.log("Last one");
    next();
  },
);

// 🟡 Route Path "braces {}", Used to make path optional, like below it's possible to give file name with any extension.
router
  .route("/file/:file{.:ext}")
  .all((req, res, next) => {
    console.log("For all routes starts with /file/file ");
    next();
  })
  .get((req, res) =>
    res
      .status(200)
      .json({ message: "Welcome to file/:file/{.:ext}", params: req.params }),
  );

router
  .route("/file/x")
  .get((req, res) => res.json({ message: "Welcome of file/output route" }));

export default router;
