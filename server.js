import redis from "redis";

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

client.on("error", (error) => {
  console.log("Redis client error occurred: ", error);
});

const connectToRedis = async () => {
  try {
    await client.connect();
    console.log("Connection to Redis established");

    await client.set("key", "Gopal");

    const extractValue = await client.get("key");
    console.log(extractValue);

    const delCount = await client.del("key");
    console.log(delCount);

    const extractUpdatedVal = await client.get("key");
    console.log(extractUpdatedVal); // "output -> null"

    await client.set("count", 100);
    const extractCount = await client.incr("count");
    console.log(extractCount);

    const decCount = await client.decr("count");
    console.log(decCount);

    await client.decr("count");
    await client.decr("count");
    await client.decr("count");
    await client.decr("count");
    await client.decr("count");

    console.log(await client.decr("count"));
  } catch (error) {
    console.log(`Connection failed: ${error}`);
  } finally {
    await client.quit();
  }
};

connectToRedis();
