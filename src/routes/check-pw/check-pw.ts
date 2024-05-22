import { User } from '@/models/user';
import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { BadRequestError } from '@/errors/bad-request-error';
import Joi from 'joi';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
const router = express.Router();

interface CheckPwDto {
  userId: string;
  password: string;
}

const schema = Joi.object<CheckPwDto>({
  userId: Joi.string().required(),
  password: Joi.string().required(),
})

router.post(
  "/",
  validateBody(schema),
  async (req: validateRequest<CheckPwDto>, res: Response) => {
    const { userId, password } = req.body;
    const user = await User.findOne({ userId });
    if (!user) {
      throw new BadRequestError("사용자 정보가 없습니다.", "_form");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError("비밀번호를 일치하지 않습니다.", "_form");
    }

    res.status(200).send({});
  }
);

export { router as checkPwRouter }