require("dotenv").config();
import mongoose from "mongoose";
import { SocketIOServer } from "./socket-io/socket-io-server";
import { app } from "./app";

const socketServer = new SocketIOServer(app);

const start = async () => {
  console.log(process.env.JWT_KEY);
  console.log(process.env.MONGO_URI);
  
  try { 
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (err) {
    console.log("몽고디비 연결 실패", err);
  }
  const port = +process.env.PORT!;
  socketServer.listen(port, () => {
    console.log(`listen ${port}~~`);
  });
};

start();
