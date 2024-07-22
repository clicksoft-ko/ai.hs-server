import { Router, Response } from "express";
import bcrypt from "bcrypt";
import { usersService } from "@/routes/users/service/users-service";
import { User } from "@/models/user";
import { SigninDto } from "../dto/signin.dto";
import { BadRequestError } from "@/errors/bad-request-error";


class SigninService {
  async signin({ userId, password, res }: SigninDto & { res: Response }) {
    const user = await User.findOne({ userId });
    const errorMessage = "아이디 혹은 비밀번호를 확인하세요.";

    if (!user) {            
      throw new BadRequestError(errorMessage, "_form");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError(errorMessage, "_form");
    }

    usersService.signJwt(res, user);

    return user;
  }
}

export const signinService = new SigninService();