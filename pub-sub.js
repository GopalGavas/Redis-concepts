// (publisher) -> "message to a (channel)" - > (subscriber) "will consume this message"

import redis from "redis";

const client = redis.createClient({
  host: "localhost",
  port: "6379",
});

client.on("error", (error) => {
  console.log("Client error: ", error);
});

const pubsuboperations = async () => {
  try {
    await client.connect();
    console.log("Redis connection successfull");

    // const subscriber = await client.duplicate(); // NOTE: "creates a new client but uses the same connection"
    // await subscriber.connect(); // "Connect to redis server for subscriber"

    // await subscriber.subscribe("dummy-channel", (message, channel) => {
    //   console.log(`Recieved message from ${channel}: ${message}`);
    // });

    // // publish message to the dummy channel
    // setTimeout(async () => {
    //   console.log("Publishing messages...");
    //   await client.publish("dummy-channel", "Some dummy data from publisher");
    //   await client.publish(
    //     "dummy-channel",
    //     "some new message again from publisher"
    //   );
    // }, 1000);

    // setTimeout(async () => {
    //   console.log("UnSubscribing...");
    //   await subscriber.unsubscribe("dummy-channel");
    //   await subscriber.quit(); // "close the subscriber connection"
    //   await client.quit();
    // }, 3000);

    // {pipeline and transactions}
    const multi = client.multi();

    multi.set("key-transaction1", "value 1");
    multi.set("key-transaction2", "value 2");
    multi.get("key-transaction1");
    multi.get("key-transaction2");

    const transactionResults = await multi.exec();
    console.log(transactionResults);

    const pipeline = client.multi();

    pipeline.set("key-pipeline1", "value 1");
    pipeline.set("key-pipeline2", "value 2");
    pipeline.get("key-pipeline1");
    pipeline.get("key-pipeline2");

    const pipelineResults = await pipeline.exec();
    console.log(pipelineResults);

    // "Batch Operations"
    console.log("Performance Test");
    console.time("Without Pipelining");

    for (let i = 0; i < 1000; i++) {
      await client.set(`user${i}`, `user_value${i}`);
    }

    console.timeEnd("Without Pipelining");
    console.time("With Pipelining");
    const bigPipeline = client.multi();

    for (let i = 0; i < 1000; i++) {
      bigPipeline.set(`user${i}`, `user_value${i}`);
    }

    await bigPipeline.exec();
    console.timeEnd("With Pipelining");
  } catch (error) {
    console.log("Connection failed: ", error);
  } finally {
    await client.quit();
  }
};

pubsuboperations();
