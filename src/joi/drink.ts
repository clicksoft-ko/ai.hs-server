import Joi from "joi";
import {
  EDrinkingFreqType,
  IDrink,
  IDrinkN7,
  IDrinkingKind,
  IDrinkingFrequency,
} from "health-screening-shared/interfaces";

const DrinkingFrequencySchema = Joi.object<IDrinkingFrequency>({
  cup: Joi.number().default(0),
  bottle: Joi.number().default(0),
  can: Joi.number().default(0),
  cc: Joi.number().default(0),
});

const DrinkingKindSchema = Joi.object<IDrinkingKind>({
  soju: DrinkingFrequencySchema,
  beer: DrinkingFrequencySchema,
  liquor: DrinkingFrequencySchema,
  makgeolli: DrinkingFrequencySchema,
  wine: DrinkingFrequencySchema,
});

const DrinkN7Schema = Joi.object<IDrinkN7>({
  type: Joi.string()
    .valid(...Object.values(EDrinkingFreqType))
    .required(),
  frequency: Joi.number().when("type", {
    not: EDrinkingFreqType.DO_NOT,
    then: Joi.required(),
  }),
});

export const DrinkSchema = Joi.object<IDrink>({
  n7: DrinkN7Schema.required(),
  n7_1: DrinkingKindSchema.when("n7.type", {
    not: EDrinkingFreqType.DO_NOT,
    then: Joi.required(),
  }),
  n7_2: DrinkingKindSchema.when("n7.type", {
    not: EDrinkingFreqType.DO_NOT,
    then: Joi.required(),
  }),
});
