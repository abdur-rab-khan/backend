import { Worker } from "bullmq";
import redisConnection from "./redis.js";

const worker = new Worker(
  "myqueue",
  async (job) => {
    const jobData = job.data;

    if (jobData.name === "Task-5") {
      // Simulating a failure for Task-5
      throw new Error("Simulated error for Task-5");
    }

    console.log("Processing job: ", jobData);

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));
  },
  {
    connection: redisConnection,
  },
);

worker.on("ready", () => {
  console.log("Worker is ready and connected to Redis!");
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});

// --> Handle if job gets completed
worker.on("completed", (job) => {
  console.log("Job get's completed: ", job.data);
});

// --> Handle if job gets failed
worker.on("failed", (job, err) => {
  console.log("Job get's failed: ", job?.data);
  console.error("Error is: ", err);
});

export default worker;

/*
 * => Worker are the class that run actually job
 *
 *
 * ===================== Canceling Jobs =====================
 * => Worker provides "abortSingle" as third arguments using that we can cancel jobs using "cancelJob('jobId', 'reason')" or we can cancel all jobs using "cancelAllJobs('reason')"
 * const w = new Worker("my-worker", async (job, token, signal) => {
    return new Promise((resolve, reject) => {
      signal?.addEventListener("abort", () => {
        const reason = signal?.reason ?? "No reason provided";

        console.log(`Job ${job.id} cancelled: ${reason}`);

        reject(new Error(`Job cancelled ${reason}`));
      });
    });
    // actual logic
  });
 *
 * */
