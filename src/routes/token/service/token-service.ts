import { Token, TokenAttrs, TokenType } from "@/models/token";
import { ValidateTokenDto } from "../dto/validate-token.dto";
import { BadRequestError } from "@/errors/bad-request-error";

class TokenService {
  async validateToken({ token, tokenType }: ValidateTokenDto & { token: string }): Promise<TokenAttrs> {
    const tokenDoc = await Token.findOne({ token, tokenType });

    if (!tokenDoc) {
      throw new BadRequestError("토큰이 만료되었습니다.");
    }

    return tokenDoc;
  }

  async delete({ userId, tokenType }: { userId: string, tokenType: TokenType }) {
    await Token.deleteMany({ userId, tokenType });
  }
}

export const tokenService = new TokenService();