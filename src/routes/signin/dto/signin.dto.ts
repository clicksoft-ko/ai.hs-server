import Joi from "joi";

export interface SigninDto {
  userId: string;
  password: string;
  withSettings?: boolean;
}

export const signinSchema = Joi.object<SigninDto>({
  userId: Joi.string().lowercase().trim().required(),
  password: Joi.string().required(),
  withSettings: Joi.bool(),
});
