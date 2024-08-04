import { ClickDeskSettings } from "@/models/settings/click-desk.schema";
import { QuestionnaireSettings } from "@/models/settings/questionnaire.schema";
import { SettingsAttrs } from "@/models/settings/settings";
import { WebAppSettings } from "@/models/settings/web-app.schema";
import Joi from "joi";

export interface UpdateSettingsDto extends SettingsAttrs { }


export const updateSettingsSchema = Joi.object<UpdateSettingsDto>({
  clickDesk: Joi.object<ClickDeskSettings>({
    use: Joi.bool(),
  }),
  webApp: Joi.object<WebAppSettings>({
    use: Joi.bool(),
  }),
  questionnaire: Joi.object<QuestionnaireSettings>({
    use: Joi.bool(),
    lockPw: Joi.string(),
  }),
}).unknown(true)