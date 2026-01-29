import mongoose from "mongoose";
import { dbName } from "../utils/constant.js";
import { MONGO_DB_COMPASS } from "../utils/env.js";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(
      `${MONGO_DB_COMPASS}${dbName}`,
    );
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    console.log("MongoDB connectoin failed", error);
    process.exit(1);
  }
};

export default connectDb;
