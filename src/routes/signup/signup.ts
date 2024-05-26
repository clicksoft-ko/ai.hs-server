import { Router, Request, Response } from "express";
import { User } from "../../models/user";
import { BadRequestError } from "../../errors/bad-request-error";
import { SignupDto, signupSchema } from "./signup.dto";
import { validateBody, validateRequest } from "../../middlewares/validate-body";
import { adminSettingsService } from "../admin-settings/admin-settings.service";
import { NotAuthorizedError } from "@/errors/not-authorized-error";

const router = Router();

router.post(
  "/",
  validateBody(signupSchema),
  async (req: validateRequest<SignupDto>, res: Response) => {
    const { userId, password, roomKey, managerCode } = req.body;
    const existingUser = await User.findOne({ userId });
    const confirmManagerCode = await adminSettingsService.getManagerCode();

    if (confirmManagerCode !== managerCode) {
      throw new NotAuthorizedError();
    }

    if (existingUser) {
      throw new BadRequestError("계정이 이미 존재합니다.", "userId");
    }

    const user = User.build({ userId, password, roomKey });
    await user.save();

    res.status(201).send(user);
  }
);

export { router as signupRouter };
