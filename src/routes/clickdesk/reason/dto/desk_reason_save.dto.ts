import Joi from "joi";

export interface DeskReasonSaveDto {
  text: string;
  useNHISHealthCheckUp: boolean;
  doctorId: string;
}

export const deskReasonSaveSchema = Joi.object<DeskReasonSaveDto>({
  text: Joi.string().trim().required().messages({
    "string.empty": "내원사유를 입력해주세요.",
  }),
  useNHISHealthCheckUp: Joi.bool().required(),
  doctorId: Joi.string().allow("").default(""),
})