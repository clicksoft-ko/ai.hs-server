import Joi from "joi";

export interface DeskSettingsFeatureUpdateDto {
  unUseQR: boolean;
}

export const deskSettingsFeatureUpdateSchema = Joi.object<DeskSettingsFeatureUpdateDto>({
  unUseQR: Joi.boolean().required(),
});