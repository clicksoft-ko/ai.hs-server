import Joi from "joi";

export interface SignupDto {
  userId: string;
  password: string;
  roomKey: string;
  managerCode: string;
}

export const signupSchema = Joi.object({
  userId: Joi.string().lowercase().trim().required().messages({
    "string.empty": `아이디를 입력하세요.`,
  }),
  password: Joi.string().required().messages({
    "string.empty": `비밀번호를 입력하세요.`,
  }),
  roomKey: Joi.string().required().messages({
    "string.empty": `연결 코드를 입력하세요.`,
  }),
  managerCode: Joi.string().required().messages({
    "string.empty": `관리자 코드를 입력하세요.`,
  }),
}).options({ abortEarly: false });
