const Redis = require("ioredis");

let redisClient = null;

const getRedisClient = () => {
  if (redisClient) return redisClient;

  const redisConfigured =
    process.env.REDIS_ENABLED === "true" ||
    Boolean(process.env.REDIS_URL) ||
    Boolean(process.env.REDIS_HOST);

  if (!redisConfigured) return null;

  const redisUrl =
    process.env.REDIS_URL ||
    `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`;

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      enableReadyCheck: true,
    });

    redisClient.on("error", (error) => {
      console.warn("[Redis] Connection warning:", error.message || error);
    });

    return redisClient;
  } catch (error) {
    console.warn("[Redis] Redis client initialization failed:", error.message || error);
    return null;
  }
};

const isRedisAvailable = async () => {
  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.ping();
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  getRedisClient,
  isRedisAvailable,
};