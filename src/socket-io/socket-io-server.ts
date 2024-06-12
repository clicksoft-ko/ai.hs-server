import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { createServer } from "node:http";
import { Express } from "express";
import { SocketIOEventHandler } from "./handlers/socket-io-event-handler";
import { socketLogMiddleware } from "@/middlewares/socket-log-middleware";

export class SocketIOServer {
  private server: HttpServer;
  private io: Server;

  constructor(app: Express) {
    this.server = createServer(app);
    this.io = new Server(this.server, {
      path: "/api/socket.io",
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    // this.io.use(socketLogMiddleware);
    this.handleConnection();
  }

  handleConnection() {
    this.io.on("connection", (socket) => {
      const evHandler = new SocketIOEventHandler(this.io, socket);

      this.io.on("error", (error) => {
        console.log("socketio error: ", error);
      });

      socket.on("joinRoom", evHandler.joinRoomEvent.bind(evHandler));

      socket.on(Ev.SaveQuestionnaire, evHandler.saveQuestionnaireEvent.bind(evHandler));

      const onBroker = (ev: string) => socket.on(ev, evHandler.brokerEvent.bind(evHandler, ev));
      onBroker(Ev.GetQuestionnaire);
      onBroker(Ev.GetReceptionPatients);
      onBroker(Ev.SaveLifestyle);
      onBroker(Ev.GetLifestyle);
      onBroker(Ev.SaveCancer);
      onBroker(Ev.GetCancer);

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

enum Ev {
  GetQuestionnaire = "getQuestionnaire",
  SaveQuestionnaire = "saveQuestionnaire",
  SaveLifestyle = "saveLifestyle",
  GetReceptionPatients = "getReceptionPatients",
  GetLifestyle = "getLifestyle",
  SaveCancer = "saveCancer",
  GetCancer = "getCancer"
}