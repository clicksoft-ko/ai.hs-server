import jwt from 'jsonwebtoken'
import { CookieOptions, Response } from 'express'
import { BadRequestError } from "@/errors/bad-request-error";
import { CheckPasswordDto } from "../dto/check-password.dto";
import { User, UserAttrs } from "@/models/user";
import bcrypt from 'bcrypt'
import { ChangePwDto } from "../dto/change-pw.dto";
import { ChangeEmailDto } from "../dto/change-email.dto";
import { FindPwDto, FindPwResponseDto } from '../dto/find-pw.dto';
import { sendChangePasswordEmail } from '@/utils/mail/mail-util';
import { randomUUID } from 'crypto';
import { Token, TokenAttrs } from '@/models/token';
import dayjs from 'dayjs'
import { tokenService } from '@/routes/token/service/token-service';

type UserIdType = { userId: string };

class UsersService {
  private async getUser(userId: string | undefined) {
    const user = userId ? await User.findOne({ userId: userId.toLowerCase() }) : undefined;
    if (!user) {
      throw new BadRequestError("사용자 정보가 없습니다.", "_form");
    }

    return user;
  }

  private async matchPassword(password: string, hashedPassword: string) {
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      throw new BadRequestError("비밀번호를 일치하지 않습니다.", "_form");
    }
  }

  signJwt(res: Response, user: UserAttrs) {
    const expiresInMinutes = 60 * 24 * 365;
    const userJwt = jwt.sign(
      {
        userId: user.userId,
        roomKey: user.roomKey,
        admin: user.admin,
        orgName: user.orgName,
        email: user.email,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: expiresInMinutes * 60,
      }
    );

    const cookieOptions: CookieOptions = {
      maxAge: expiresInMinutes * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("user", JSON.stringify(user), cookieOptions);
    res.cookie("jwt", userJwt, cookieOptions);
  }

  async checkPassword({ userId, password }: CheckPasswordDto & UserIdType) {
    const user = await this.getUser(userId);

    await this.matchPassword(password, user.password);
  }

  async changePassword({ userId, password }: ChangePwDto & UserIdType) {
    const user = await this.getUser(userId);

    user.password = password;
    await user.save();
    await tokenService.delete({ userId, tokenType: "changePw" });
  }

  async changeEmail({ userId, email }: ChangeEmailDto & UserIdType): Promise<UserAttrs> {
    const user = await this.getUser(userId);

    user.email = email;
    return user.save();
  }

  async findPassword({ userId, email }: FindPwDto & UserIdType): Promise<FindPwResponseDto> {
    const user = await this.getUser(userId);
    if (user.email !== email) {
      throw new BadRequestError("이메일이 일치하지 않습니다.");
    }
    const uuid = randomUUID();
    const token = Token.build({
      token: uuid,
      userId: userId,
      tokenType: 'changePw',
      expiredAt: dayjs().add(30, "m").toDate(),
    })

    await token.save();
    await sendChangePasswordEmail({ to: email, token: uuid });

    return { email, token: uuid }
  }

  async getAllUsers(): Promise<UserAttrs[] | undefined> {
    const users = await User.find();

    return users;
  }
}

export const usersService = new UsersService