import { Router, Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import { SignupDto, signupSchema } from "./signup.dto";
import { validateBody, validateRequest } from "../../middlewares/validate-body";

const router = Router();

router.post(
  "/",
  validateBody(signupSchema),
  async (req: validateRequest<SignupDto>, res: Response) => {
    const { userId, password, roomKey } = req.body;
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      throw new BadRequestError("계정이 이미 존재합니다.", "userId");
    }

    const user = User.build({ userId, password, roomKey });
    await user.save();
    // const userJwt = jwt.sign({ userId: user.userId }, process.env.JWT_KEY!);
    // req.session = { jwt: userJwt };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
