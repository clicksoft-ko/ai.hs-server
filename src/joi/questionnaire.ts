import Joi from "joi";
import { HistorySchema } from "./history";
import { SmokingSchema } from "./smoking";
import { DrinkSchema } from "./drink";
import { ActivitySchema } from "./activity";
import {
  IHistory,
  ISmoking,
  IDrink,
  IActivity,
} from "health-src-shared/interfaces";

export const QuestionnaireSchema = Joi.object<{
  history: IHistory;
  smoking: ISmoking;
  drink: IDrink;
  activity: IActivity;
}>({
  history: HistorySchema.required(),
  smoking: SmokingSchema.required(),
  drink: DrinkSchema.required(),
  activity: ActivitySchema.required(),
});
