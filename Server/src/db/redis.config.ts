import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
  password: process.env.REDIS_PASSWORD,
  tls: {},
  maxRetriesPerRequest: process.env.REDIS_MAXRETRIES? parseInt(process.env.REDIS_MAXRETRIES, 10) : undefined,
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export default redis;
