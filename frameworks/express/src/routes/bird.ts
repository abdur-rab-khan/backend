import { Router } from "express";

/* 
 👉 Router is like a mini app that will only handle endpoints that specified on root, using this we can create "custom middleware for a particular route", "making the code more modular". 
 👉 Like in route only going to handle routes that starts with "/bird"
 ⭐ Always put all static routes first, then put dynamic routes in such a way to that no collision happen

 🟡 Router Options:
     1. "mergeParams: true": By default if root path (app.use("/file/:name", fileRouter)) have any "path params", We can't access them on the router So that we have to override the default behaviors
*/

const router = Router({ mergeParams: true });

// 👉 It's "Express" supports all HTTP methods, but there is a special method called ".all", that accepts all kind of methods from an endpoint.

// 👉 It's possible to chain the same route with difference "HTTP METHODS"
// ❌ Notice, something wrong, Not fully wrong but, suppose after sometime we need to change from "/" to something else we have to do at every place which is headache, that why we use router.route
router
  .get("/", (req, res) => {
    console.log(req.params);
    res.status(200).json({ message: "welcome to bird / route" });
  })
  .post("/", (_, res) =>
    res.status(201).json({ message: "Welcome to bird / post route" }),
  );

// ✅ It's more cleaner and maintainable
router
  .route("/")
  .get((req, res) => res.json({ message: "Welcome to bird/ GET route" }))
  .post((req, res) => res.json({ message: "Welcome to bird/ POST route" }));

router.get("/about", (req, res) => {
  console.log(req.params);
  res.status(200).json({ message: "welcome to bird /about route" });
});

export default router;
