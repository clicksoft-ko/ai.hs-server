import { SettingsAttrs } from "@/models/settings/settings";
import { updateSettingsSchema } from "@/routes/settings/dto/update-settings.dto";
import Joi from "joi";

export interface UpdateUserDto {
  email: string;
  orgName: string;
  settings?: SettingsAttrs;
}

export const updateUserSchema = Joi.object<UpdateUserDto>({
  email: Joi.string().email().required(),
  orgName: Joi.string().required(),
  settings: updateSettingsSchema,
})