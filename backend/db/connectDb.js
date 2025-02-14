import mongoose from "mongoose";

export const connectToDb = async (req, res) => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    const host = connect.connection.host;
    console.log(`MongoDb Connected : ${host}`);
  } catch (error) {
    console.log(`Error connecting to db : ${error}`);
    process.exit(1);
  }
};
