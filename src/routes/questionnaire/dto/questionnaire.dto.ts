import Joi from "joi";
import {
  IHistory,
  ISmoking,
  IDrink,
  IActivity,
} from "health-screening-shared/interfaces";
import { HistorySchema } from "../../_joi/history";
import { SmokingSchema } from "../../_joi/smoking";
import { DrinkSchema } from "../../_joi/drink";
import { ActivitySchema } from "../../_joi/activity";

export interface IQuestionnaireDto {
  history: IHistory;
  smoking: ISmoking;
  drink: IDrink;
  activity: IActivity;
}

export const QuestionnaireSchema = Joi.object<IQuestionnaireDto>({
  history: HistorySchema.required(),
  smoking: SmokingSchema.required(),
  drink: DrinkSchema.required(),
  activity: ActivitySchema.required(),
});
