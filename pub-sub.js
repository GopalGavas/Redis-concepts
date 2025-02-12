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

    const subscriber = await client.duplicate(); // NOTE: "creates a new client but uses the same connection"
    await subscriber.connect(); // "Connect to redis server for subscriber"

    await subscriber.subscribe("dummy-channel", (message, channel) => {
      console.log(`Recieved message from ${channel}: ${message}`);
    });

    // publish message to the dummy channel
    setTimeout(async () => {
      console.log("Publishing messages...");
      await client.publish("dummy-channel", "Some dummy data from publisher");
      await client.publish(
        "dummy-channel",
        "some new message again from publisher"
      );
    }, 1000);

    setTimeout(async () => {
      console.log("UnSubscribing...");
      await subscriber.unsubscribe("dummy-channel");
      await subscriber.quit(); // "close the subscriber connection"
      await client.quit();
    }, 3000);

    // {pipeline and transactions}
  } catch (error) {
    console.log("Connection failed: ", error);
  }
};

pubsuboperations();
