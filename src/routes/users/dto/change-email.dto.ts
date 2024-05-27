import Joi from "joi";

export interface ChangeEmailDto {
  email: string;
}

export const ChangeEmailDtoSchema = Joi.object<ChangeEmailDto>({
  email: Joi.string().email().messages({
    "string.email": `이메일 형식을 확인해주세요.`,
  }),
})
