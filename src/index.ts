require("dotenv").config();
import mongoose from "mongoose";
import { SocketIOServer } from "./socket-io/socket-io-server";
import { app } from "./app";
import { logger, loggerError } from "./logger/logger";

const socketServer = new SocketIOServer(app);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error) {
    loggerError({ errorCode: "MONGODB_CONN", error });
  }
  const port = +process.env.PORT!;
  socketServer.listen(port, () => {
    logger.info(`Listen ${port}`)
  });
};

start();
