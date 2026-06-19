import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import logger from "../logger";

const router = Router();

/*
    🟡 Middleware is a function that invoked before hitting the actually end point logic based on provided path, To use a middleware we need to use a function called "app/router/route/[http method -> get, post, delete, all .etc].use(path, function)".
    🟡 We can either provide a "path" So that the middleware only run for a particular or we can skip path to run on every request happen on app or a particular router.
*/

// Logger for only middleware route and it will going to run on every request hit on "app.use("/middleware", middleware)"
router.use((req, res, next) => {
  logger.log(
    `[ Middleware Route ]: Request happened at ${Date.now()} on ${req.path}`,
  );
  next();
});

const fileAuth = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  if (body?.name !== "Abdur Rab Khan") {
    return res.status(404).json({ message: "Invalid Access" });
  }

  next();
};

// Only going to run on "/file GET" method
const validData = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  if (body?.pass !== "get-file-1234") {
    return res.status(404).json({ message: "Invalid Access" });
  }

  next();
};

router
  .route("/file")
  .all(fileAuth) // Going to run this fileAuth on every route
  .get(validData, (req, res) =>
    res.json({ message: "Welcome to /middleware/file GET route" }),
  )
  .post((req, res) =>
    res.json({ message: "Welcome to /middleware/file POST route" }),
  )
  .delete((req, res) =>
    res.json({ message: "Welcome to /middleware/file DELETE route" }),
  );

export default router;
