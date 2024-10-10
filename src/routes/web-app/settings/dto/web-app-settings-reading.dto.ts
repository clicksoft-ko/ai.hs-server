import Joi from 'joi';

export interface WebAppSettingsReadingDto {
  commonDays: number;
  gumsaDays: number;
}

export const webAppSettingsReadingSchema = Joi.object<WebAppSettingsReadingDto>({
  commonDays: Joi.number().required(),
  gumsaDays: Joi.number().required(),
});