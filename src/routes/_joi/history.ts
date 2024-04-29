import Joi from "joi";
import {
  IHistory,
  IHistoryN1,
  IHistoryN1Result,
  IHistoryN2,
} from "health-screening-shared/interfaces";

const EHistoryN3 = {
  yes: 1,
  no: 2,
  doNotKnown: 3,
};

const HistoryN1ResultSchema = Joi.object<IHistoryN1Result>({
  diagnosis: Joi.boolean().default(false).description("진단"),
  drugTherapy: Joi.boolean().default(false).description("약물치료"),
}).default({ diagnosis: false, drugTherapy: false });

const HistoryN1Schema = Joi.object<IHistoryN1>({
  stroke: HistoryN1ResultSchema,
  angina: HistoryN1ResultSchema,
  hypertension: HistoryN1ResultSchema,
  diabetes: HistoryN1ResultSchema,
  dyslipidemia: HistoryN1ResultSchema,
  PT: HistoryN1ResultSchema,
  others: HistoryN1ResultSchema,
});

const HistoryN2Schema = Joi.object<IHistoryN2>({
  stroke: Joi.boolean().default(false).description("뇌졸증"),
  angina: Joi.boolean().default(false).description("협심증"),
  hypertension: Joi.boolean().default(false).description("고혈압"),
  diabetes: Joi.boolean().default(false).description("당뇨병"),
  others: Joi.boolean().default(false).description("기타"),
});

export const HistorySchema = Joi.object<IHistory>({
  n1: HistoryN1Schema,
  n2: HistoryN2Schema,
  n3: Joi.valid(...Object.values(EHistoryN3)).required(),
});

module.exports = { HistorySchema };
