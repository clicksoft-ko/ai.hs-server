import Joi from "joi";
import { IActivity, IActivityTerm } from "health-src-shared/interfaces";

const ActiveTermSchema = Joi.object<IActivityTerm>({
  hours: Joi.number().min(1).max(23).required(),
  minutes: Joi.number().min(0).max(59).default(0).required(),
});

export const ActivitySchema = Joi.object<IActivity>({
  n8_1: Joi.number().min(1).max(7).required(),
  n8_2: ActiveTermSchema.required(),
  n9_1: Joi.number().min(1).max(7).required(),
  n9_2: ActiveTermSchema.required(),
  n10: Joi.number().required(),
});
