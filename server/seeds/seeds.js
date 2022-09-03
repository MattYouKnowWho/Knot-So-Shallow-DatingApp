const userSeeds = require("./userSeeds.json");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

require("dotenv").config();

const uri = 'mongodb+srv://root:root@cluster0.54y1gfg.mongodb.net/?retryWrites=true&w=majority'

const seed= async () => {
  let client;
  try {
    client = new MongoClient(uri);

    
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    
    console.log(userSeeds[0])
    userSeeds.map(async (user) => {
        console.log("looping")
        const generatedUserId = uuidv4();
        const hashedPassword = await bcrypt.hash(user.password, 10);
        console.log("igot here"); 
        const existingUser = await users.findOne({ email: user.email });

        if (existingUser) {
        return console.log("User already exists. Please login");
        }

        const sanitizedEmail = user.email.toLowerCase();

        const data = {
        user_id: generatedUserId,
        email: sanitizedEmail,
        hashed_password: hashedPassword,
        onboarded: false,
        };

        const insertedUser = await users.insertOne(data);

        if(insertedUser){
        console.log('inserted User')
        }
    })
    await client.close();
    } catch (err) {
    // await client.close();
    console.error(err);
    process.exit(1);
  }

  

  console.log("all done!");
  process.exit(0);
};
seed()