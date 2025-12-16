import { Redis } from "ioredis";

// Redis is neccessory for queue, So here we use single connection of redis using redis-io and use in all queues.
//
const redisConnection = new Redis({
  host: "localhost",
  port: 6379,
  password: process.env.REDIS_PASSWORD ?? "redis-password",
  maxRetriesPerRequest: null, // Neccessory to be "null" ***
});

export default redisConnection;
