import dontenv from "dotenv";
import mongoose from "mongoose";
dontenv.config(); //explicitly loadin the env file
const dbURI = process.env.mongoURI;

export const connectDb = async () => {
  try {
    const connection = await mongoose.connect(dbURI);
    console.log("mongo connected at:", connection.connection.host);
  } catch (error) {
    console.log("failed to connect at errors:", error.message);
    process.exit(1);
  }
};
