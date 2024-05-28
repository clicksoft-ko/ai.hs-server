import Joi from "joi";

export interface SignupDto {
  userId: string;
  password: string;
  email: string;
  orgName: string;
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
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.empty": `이메일을 입력하세요.`,
    "string.email": `올바른 이메일 형식이 아닙니다.`,
  }),
  orgName: Joi.string().required().messages({
    "string.empty": `기관이름을 입력하세요.`,
  }),
  roomKey: Joi.string().required().messages({
    "string.empty": `연결 코드를 입력하세요.`,
  }),
  managerCode: Joi.string().required().messages({
    "string.empty": `관리자 코드를 입력하세요.`,
  }),

}).options({ abortEarly: false });
