import { Router, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import { SigninDto, signinSchema } from "./signin.dto";
import { validateBody, validateRequest } from "../../middlewares/validate-body";
import bcrypt from "bcrypt";
import { usersService } from "../users/service/users-service";

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

    usersService.signJwt(res, user);

    res.status(201).send(user);
  }
);

export { router as signinRouter };
