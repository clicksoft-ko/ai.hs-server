import {
  Router,
  Request,
  Response,
  NextFunction,
  CookieOptions,
} from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import { SigninDto, signinSchema } from "./signin.dto";
import { validateBody, validateRequest } from "../../middlewares/validate-body";
import bcrypt from "bcrypt";

const router = Router();

router.post(
  "/",
  validateBody(signinSchema),
  async (req: validateRequest<SigninDto>, res: Response) => {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    const errorMessage = "아이디 혹은 비밀번호를 확인하세요.";

    if (!user) {
      throw new BadRequestError(errorMessage, "_form");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError(errorMessage, "_form");
    }

    const expiresInMinutes = 60 * 24 * 365;
    const userJwt = jwt.sign(
      { userId: user.userId, roomKey: user.roomKey },
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
    res.status(201).send(user);
  }
);

export { router as signinRouter };
