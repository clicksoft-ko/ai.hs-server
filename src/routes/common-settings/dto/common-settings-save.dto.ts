import { AdMessage } from "@/models/types/ad-message";
import Joi from "joi";

export const commonSettingsSaveSchema = Joi.object<CommonSettingsSaveDto>({
  message: Joi.string(),
  animationSeconds: Joi.number()
});


export interface CommonSettingsSaveDto extends AdMessage { }
