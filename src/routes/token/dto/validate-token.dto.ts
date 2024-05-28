import { TokenType } from "@/models/token";
import Joi from "joi";

export interface ValidateTokenDto {
  userId?: string;
  tokenType: TokenType;
}

const tokenTypes: TokenType[] = ['changePw'];

export const validateTokenDtoSchema = Joi.object<ValidateTokenDto>({
  tokenType: Joi.string().valid(...tokenTypes).messages({
    "string.require": `토큰 타입을 명시해주세요.`,
    "string.valid": `토큰 타입이 잘 못 되었습니다.`,
  }),
})
