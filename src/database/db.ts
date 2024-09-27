import { loggerError } from "@/logger/logger";
import mongoose from "mongoose";

let db: mongoose.Connection;

const connectDB = () => {
  try {
    db = mongoose.createConnection(process.env.MONGO_URI!);
  } catch (error) {
    loggerError({ errorCode: "MONGODB_CONN", error });
    process.exit(1);
  }
};

connectDB();

export { connectDB, db };

