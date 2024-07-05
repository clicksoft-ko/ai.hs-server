import Joi from "joi";

export interface DeskDoctorUpdateSeqDto {
  codes: { code: string, seq: number }[],
}

export const deskDoctorUpdateSeqSchema = Joi.object<DeskDoctorUpdateSeqDto>({
  codes: Joi.array().items(
    Joi.object({
      code: Joi.string().required(),
      seq: Joi.number().integer().required()
    })
  ).required(),
});