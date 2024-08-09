import { ReasonState, ReasonSub } from "@/models/desk-reason";
import Joi from "joi";

export interface DeskReasonUpdateDto extends ReasonState { }

const reasonSubSchema = Joi.object({
  seq: Joi.number().required(),
  text: Joi.string().required(),
  subs: Joi.array(), // 재귀적 스키마 정의
});

export const reasonUpdateSchema = Joi.object<DeskReasonUpdateDto>({
  id: Joi.string().required(),
  userId: Joi.string(),
  useNHISHealthCheckUp: Joi.bool().required(),
  doctorId: Joi.string().allow("").default(""),
  seq: Joi.number().required(),
  text: Joi.string().required(),
  subs: Joi.array().items(reasonSubSchema)  // sub 필드는 reasonSubSchema 배열
});

