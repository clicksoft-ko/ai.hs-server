import Joi from "joi";

export interface DeskDoctorDeleteDto {
  code: string,
}

export const deskDoctorDeleteSchema = Joi.object<DeskDoctorDeleteDto>({
  code: Joi.string().required(),
})