import { DeskDoctorAttrs } from "@/models/desk_doctor";
import Joi from "joi";

export interface DeskDoctorSaveDto {
  seq: number,
  code: string,
  name: string,
  jinchalName: string,
  kwamokName: string,
}

export const deskDoctorSaveSchema = Joi.object<DeskDoctorSaveDto>({
  seq: Joi.number().required(),
  code: Joi.string().required(),
  jinchalName: Joi.string().required(),
  name: Joi.string().required(),
  kwamokName: Joi.string().required(),
})