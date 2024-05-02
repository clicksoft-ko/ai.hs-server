import { Server, Socket } from "socket.io";
import { QuestionnaireSchema, flattenJoiError } from "health-screening-shared/joi";
import * as sock from "health-screening-shared/interfaces.socket";
import { JoinRoomDto } from "../models/join-room.dto";
import Joi from "joi";

export class SocketIOEventHandler {
  constructor(private io: Server, private socket: Socket) {}

  async joinRoomEvent(data: JoinRoomDto, ack: (ack: boolean) => void) {
    this.socket.join(data.key);

    ack?.(true);
  }

  async saveQuestionnaireEvent(
    data: sock.SaveQuestionnaireArgs,
    ack: (ack: sock.SaveQuestionnaireResult) => void
  ) {
    await this.catchWrapper(async () => {
      const schema = (QuestionnaireSchema as Joi.ObjectSchema<any>).keys({
        key: Joi.string().required(),
        eiAuto: Joi.number().required(),
      });

      const { error } = schema.validate(data);
      if (error) {
        const flattenError = flattenJoiError(error);
        ack?.({ status: "error", error: flattenError });
        return;
      }

      const result = await this.io
        .to(data.key)
        .timeout(10000)
        .emitWithAck("saveQuestionnaire", data);

      console.log("result", result);

      ack?.({ status: "success" });
    });
  }

  async getReceptionPatientsEvent(
    data: sock.GetReceptionPatientsArgs,
    ack: (ack: sock.GetReceptionPatientsResult) => void
  ) {
    await this.catchWrapper(async () => {
      const result = await this.io
        .to(data.key)
        .timeout(10000)
        .emitWithAck("getReceptionPatients", data);

      const resultData = result?.[0];
      console.log("result", resultData);

      ack?.({ status: "success", data: resultData });
    });
  }

  async catchWrapper(callback: () => Promise<void>) {
    try {
      await callback();
    } catch (error: any) {
      console.log("Socket.IO Error: ", error.message);
    }
  }
}
