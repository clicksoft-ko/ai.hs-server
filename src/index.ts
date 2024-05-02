require("dotenv").config();
import mongoose from "mongoose";
import { SocketIOServer } from "./socket-io/socket-io-server";
import { app } from "./app";

const socketServer = new SocketIOServer(app);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.log("몽고디비 연결 실패", err);
  }

  socketServer.listen(4020, () => {
    console.log("listen 4020");
  });
};

start();
