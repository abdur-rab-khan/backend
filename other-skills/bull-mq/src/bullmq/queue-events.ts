import { QueueEvents } from "bullmq";
import redisConnection from "./redis.js";

// --> "QueueEvents" provide a ways to listen all works at a single place --> Provide Global way to handle all events at single place
const queueEvents = new QueueEvents("myqueue", {
  connection: redisConnection,
});

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`----- GLOBAL -------\n A job with ID ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(
    `----- GLOBAL -------\n Job ${jobId} is now active; previous status was ${prev}`
  );
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(
    `----- GLOBAL -------\n ${jobId} has completed and returned ${returnvalue}`
  );
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(
    `----- GLOBAL -------\n ${jobId} has failed with reason ${failedReason}`
  );
});
