import { loggerError, loggerHttp } from "@/logger/logger";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);    
  } catch (error) {
    loggerError({ errorCode: "MONGODB_CONN", error });
    process.exit(1);
  }
};

export { connectDB };

