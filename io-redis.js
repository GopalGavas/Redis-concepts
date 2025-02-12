import Redis from "ioredis";

const redis = new Redis();

const ioRedisDemo = async () => {
  try {
    await redis.set("key", "value");
    const value = await redis.get("key");
    console.log(value);
  } catch (error) {
    console.log(error);
  } finally {
    redis.quit();
  }
};

ioRedisDemo();
