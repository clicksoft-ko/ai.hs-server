require("dotenv").config();
import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.log("몽고디비 연결 실패", err);
  }
  app.listen(8000, () => {
    console.log("listen 8000");
  });
};

start();
