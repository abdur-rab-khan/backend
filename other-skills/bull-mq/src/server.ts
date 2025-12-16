import Express from "express";
import type { Request, Response } from "express";
import queue from "./bullmq/queue.js";
import "./bullmq/worker.js";
import "./bullmq/queue-events.js";

// Check if REDIS_PASSWORD is set
if (!process.env.REDIS_PASSWORD) {
  console.warn(
    "WARNING: REDIS_PASSWORD environment variable is not set. Connection might fail if Redis requires a password."
  );
}

const app = Express();
const PORT = 8080;

let taskNum = 0;

app.use(Express.json());

// --> Handling add jobs in a queue.
app.post("/add-job", async (req: Request, res: Response) => {
  taskNum++;

  await queue.add(`amazing-task-${taskNum}`, {
    name: `Task-${taskNum}`,
    value: {
      key1: "value1",
      key2: "value2",
    },
  });

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Job added successfully",
  });
});

// ----> Starting the server ---> on port 8080
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 App is listening on http://localhost:${PORT}`);
});
