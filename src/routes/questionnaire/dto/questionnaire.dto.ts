import Joi from "joi";
import {
  IHistory,
  ISmoking,
  IDrink,
  IActivity,
} from "health-screening-shared/interfaces";
import {
  ActivitySchema,
  DrinkSchema,
  HistorySchema,
  SmokingSchema,
} from "health-screening-shared/joi";

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
