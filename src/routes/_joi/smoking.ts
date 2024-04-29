import Joi from "joi";
import {
  ISmoking,
  ISmokingResult,
  ISmokingTerm,
} from "health-screening-shared/interfaces";

const ISmokingN6d1 = {
  no: 0,
  everyDay: 1,
  month_1_2: 2,
  month_3_9: 3,
  month_10_29: 4,
};

const SmokingTermSchema = Joi.object<ISmokingTerm>({
  totalYears: Joi.number().min(1).max(99).default(0).required(),
  cigarettes: Joi.number().min(1).max(999).default(0).required(),
  quitYears: Joi.number().min(1).max(99),
});

const SmokingResultSchema = Joi.object<ISmokingResult>({
  smoking: Joi.boolean().required(),
  term: SmokingTermSchema.required().when("smoking", {
    is: true,
    then: SmokingTermSchema.required(),
    otherwise: SmokingTermSchema.required().keys({
      quitYears: Joi.required(),
    }),
  }),
});

export const SmokingSchema = Joi.object<ISmoking>({
  n4: Joi.boolean().required(),
  n4_1: SmokingResultSchema.when("n4", {
    is: true,
    then: SmokingResultSchema.required(),
  }),
  n5: Joi.boolean().required(),
  n5_1: SmokingResultSchema.when("n5", {
    is: true,
    then: SmokingResultSchema.required(),
  }),
  n6: Joi.boolean().required(),
  n6_1: Joi.number()
    .valid(...Object.values(ISmokingN6d1))
    .when("n6", {
      is: true,
      then: Joi.required(),
    }),
});
