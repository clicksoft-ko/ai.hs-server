import { Server, Socket } from "socket.io";
import { QuestionnaireSchema, flattenJoiError } from "health-screening-shared/joi";
import * as sock from "health-screening-shared/interfaces.socket";
import { JoinRoomDto } from "../models/join-room.dto";
import Joi from "joi";
import { loggerError, loggerSocket } from "@/logger/logger";
import { SocketEvError } from "@/errors/socket-ev-error";

interface SocketResponse<T> {
  status: "success" | "error" | "none";
  data?: T;
  error?: { [key: string]: string };
  errorCode?: string;
  message?: string;
}
export class SocketIOEventHandler {
  constructor(private io: Server, private socket: Socket) { }

  async joinRoomEvent(data: JoinRoomDto, ack: (ack: any) => void) {
    const rooms = Array.from(this.socket.rooms).slice(1);
    const existRoom = rooms.some(room => room === data.key)
    const anotherRooms = rooms.filter(room => room != data.key)

    // 클라이언트가 방이 변경된 경우 이전 방은 나간다.
    anotherRooms?.forEach(room => {
      this.io.to(room).emit("leaveRoom", { room })
      this.socket.leave(room)
    });

    // 클라이언트가 방이 없는 경우 방에 들어간다.
    const emitData = { room: data.key }
    const isValidKey = !!data.key;

    if (!existRoom && isValidKey) {
      this.io.to(data.key).emit("leaveRoom", emitData); // 다른 클라이언트에 해당 방이 존재하면 나간다고 알림.
      this.io.socketsLeave(data.key); // 다른 클라이언트에 해당 방이 존재하면 나간다.
      this.socket.join(data.key);
    }

    const response: SocketResponse<any> = {
      status: existRoom
        ? "none"
        : isValidKey ? 'success' : 'error',
      data: { room: data.key }
    }
    ack?.(response);
  }

  getResult(result: any) {
    const resultData = result?.[0];
    if (!resultData) {
      throw new Error("클라이언트로부터 요청을 실패했어요.")
    }

    return resultData;
  }

  async saveQuestionnaireEvent(
    data: sock.SaveQuestionnaireArgs,
    ack: (ack: sock.SaveQuestionnaireResult) => void
  ) {
    const ev = "saveQuestionnaire";

    await this.catchWrapper(ev, data.key, async () => {
      const schema = (QuestionnaireSchema as Joi.ObjectSchema<any>).keys({
        key: Joi.string().required(),
        eiAuto: Joi.number().required(),
      });

      const { error } = schema.validate(data);
      if (error) {
        const flattenError = flattenJoiError(error);
        ack?.({ status: "error", error: flattenError } satisfies SocketResponse<any>);
        return;
      }

      const result = await this.io
        .to(data.key)
        .timeout(10000)
        .emitWithAck(ev, data);

      const resultData = this.getResult(result)
      if (resultData.status === 'error') {
        ack?.(resultData);
      }
      ack?.({ status: "success", data: resultData } satisfies SocketResponse<any>);
    }, ack);
  }

  async brokerEvent(
    ev: string,
    data: GetQuestionnaireArgs,
    ack: (ack: any) => void
  ) {
    await this.catchWrapper(ev, data.key, async () => {
      const result = await this.io
        .to(data.key)
        .timeout(10000)
        .emitWithAck(ev, data);

      const resultData = this.getResult(result);
      if (resultData?.status === 'error') {
        throw new SocketEvError({ ...resultData }, ev)
      }

      ack?.({ status: "success", data: resultData } satisfies SocketResponse<any>);
    }, ack);
  }

  async catchWrapper(ev: string, room: string, callback: () => Promise<void>, ack: (ack: sock.EmitResultBase<any>) => void) {
    try {
      const startTime = Date.now()
      await callback();
      const evTime = Date.now() - startTime;
      loggerSocket({ ev, evTime, room });
    } catch (error: any) {
      loggerError({ errorCode: 'SOCKET_EV', error, ev })
      if (error instanceof SocketEvError) {
        ack?.({ ...error.error, status: "error" } satisfies SocketResponse<any>);
      } else {
        ack?.({ status: "error", message: error.message } satisfies SocketResponse<any>);
      }
    }
  }
}


class GetQuestionnaireArgs {
  key: string;
  eiAuto: number;
  kind: sock.EQuestionnaireKind;
  type: sock.EQuestionnaireType;
}