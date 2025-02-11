import redis from "redis";

const client = await redis.createClient({
  host: "localhost",
  port: 6379,
});

client.on("error", (error) => {
  console.log(`Client error occurred:  ${error}`);
});

const dataStructuresRedis = async () => {
  try {
    await client.connect();
    console.log(`Redis connection successfull`);

    // [STRING] -> "set, get, mset, mget"
    /*
    await client.set("user:name", "Gopal Gavas");
    const name = await client.get("user:name");
    console.log(name);

    await client.mSet([
      "user:email",
      "gopalgavas@gmail.com",
      "user:password",
      "gopal123",
      "user:age",
      "21",
      "user:country",
      "India",
    ]);

    const [email, password, age, country] = await client.mGet([
      "user:email",
      "user:password",
      "user:age",
      "user:country",
    ]);

    console.log(email, password, age, country);
    */

    // [LIST]
    // {LPUSH} -> "Insert elements at the beginning (left side)"
    // await client.lPush("notes", ["note 1", "note 2", "note 3"]);

    // {RPUSH} -> "Insert elements at the end (right side)"
    // await client.rPush("notes", ["note4"]);

    // {LPOP} -> "Remove from the left (first element)"
    // const leftPop = await client.lPop("notes");
    // console.log("Left Pop: ", leftPop);

    // {RPOP} -> "Remove from the right (last element)"
    // const rightPop = await client.rPop("notes");
    // console.log("Right Pop: ", rightPop);

    // {LRANGE} ->"Get all elements from the list"
    // const extractNotes = await client.lRange("notes", 0, -1);
    // console.log(extractNotes);

    // [SETS]
    // {SADD} -> "Add unique elements to the set"
    await client.sAdd("languages", [
      "javascript",
      "typescript",
      "go",
      "python",
      "java",
    ]);
    await client.sAdd("languages", "javascript"); // duplicates won't be added

    // {SMEMBERS} -> "Get all elements of the set"
    const allLanguages = await client.sMembers("languages");
    console.log(allLanguages);

    // {SISMEMBER} -> "Check if an element exists in the set (1 = exists, 0 = does not exist)"
    const pythonExists = await client.sIsMember("languages", "python");
    console.log("Is Python in set: ", pythonExists ? "Yes" : "No");

    // {SREM} -> "Remove an element from the set"
    await client.sRem("languages", "java");
    console.log("Removed Java from the set");

    const updatedLanguages = await client.sMembers("languages");
    console.log(updatedLanguages);
  } catch (error) {
    console.log(`Connection failed: ${error}`);
  } finally {
    await client.quit();
  }
};

dataStructuresRedis();
