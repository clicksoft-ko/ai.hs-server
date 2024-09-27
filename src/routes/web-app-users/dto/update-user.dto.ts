import { SettingsAttrs } from "@/models/settings/settings";
import { updateSettingsSchema } from "@/routes/settings/dto/update-settings.dto";
import Joi from "joi";

export interface UpdateUserDto {
  email: string;
  orgName: string;
  settings?: SettingsAttrs;
  geoLocation?: {
    lat: number;
    lng: number;
  };
}

export const updateUserSchema = Joi.object<UpdateUserDto>({
  email: Joi.string().email().required(),
  orgName: Joi.string().required(),
  settings: updateSettingsSchema,
  geoLocation: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lng: Joi.number().min(-180).max(180).required(),
  }),
})