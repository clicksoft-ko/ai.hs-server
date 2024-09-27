import Joi from "joi";

export interface ChangePwDto {
  password: string;
}

export const changePasswordDtoSchema = Joi.object<ChangePwDto>({
  password: Joi.string().required().messages({
    "string.empty": `비밀번호를 입력하세요.`,
  }),
})
