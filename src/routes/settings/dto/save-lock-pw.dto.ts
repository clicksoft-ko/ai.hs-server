import Joi from "joi";

export interface SaveLockPwDto {
  lockPw: string;
}

export const saveLockpwDtoSchema = Joi.object<SaveLockPwDto>({
  lockPw: Joi.string().required(),
})