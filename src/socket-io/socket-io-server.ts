import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createServer } from "node:http";
import { JoinRoomDto } from "./models/join-room.dto";
import { Express } from "express";
import { SocketIOEventHandler } from "./handlers/socket-io-event-handler";

export class SocketIOServer {
  private server: HttpServer;
  private io: Server;

  constructor(app: Express) {
    this.server = createServer(app);
    this.io = new Server(this.server, {
      path: "/api/socket.io",
      cors: { origin: ["https://hs.click-soft.co.kr"], credentials: true },
    });
    this.handleConnection();
  }

  handleConnection() {
    this.io.on("connection", (socket) => {
      const eventHandler = new SocketIOEventHandler(this.io, socket);

      this.io.on("error", (error) => {
        console.log("socketio error: ", error);
      });

      socket.on("joinRoom", eventHandler.joinRoomEvent.bind(eventHandler));

      socket.on(
        "saveQuestionnaire",
        eventHandler.saveQuestionnaireEvent.bind(eventHandler)
      );
      socket.on(
        "getReceptionPatients",
        eventHandler.getReceptionPatientsEvent.bind(eventHandler)
      );

      console.log(`${socket.id} user connected`);
      socket.on("disconnect", () => {
        console.log(`${socket.id} user disconnected`);
      });
    });
  }

  listen(port: number, listeningListener?: (() => void) | undefined) {
    this.server.listen(port, listeningListener);
  }
}
