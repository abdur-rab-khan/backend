import { Queue } from "bullmq";
import redisConnection from "./redis.js";

const queue = new Queue("myqueue", {
  connection: redisConnection,
});

await queue.setGlobalConcurrency(4);

queue.on("error", (err) => {
  console.error("Queue error:", err);
});

export default queue;

/*
 * ===================== AUTO REMOVE  =====================
 * 1. removeOnComplete -> automatically removed once completed -- true
 * 2. removeOnFail -> automatically removed once completed -- true
 *
 * We can also do like that "removeOnComplete: 1000" --> "1000" jobs will be keeped once completed
 *
 * Or we can specify the "age" -> like "removeOnFail: {age: 24 * 3600, count: 100}" -> keep "24 hours" once failed --> count tell keep upto "100"
 *
 * ===================== Global Concurrency =====================
 * => It tell how many jobs are allowed to run parallelly actually all workers
 *
 * await queue.setGlobalConcurrency(4)  --> 4 parallel jobs are allowed
 *
 * ===================== Removing Jobs =====================
 *
 * => queue.drain() --> remove all wating and deleyed jobs
 * => queue.clean() --> remove all jobs based on given options like -> (6000, 1000, 'paused') -> clean all "1000" jobs within 1 min which is "pasued"
 *
 */
