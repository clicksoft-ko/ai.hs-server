import Joi from "joi";

export interface FindPwDto {
  email: string;
}

export interface FindPwResponseDto {
  email: string;
  token: string;
}

export const findPasswordDtoSchema = Joi.object<FindPwDto>({
  email: Joi.string().email().trim().lowercase().messages({
    "string.email": `이메일 형식을 확인해주세요.`,
  }),
})
