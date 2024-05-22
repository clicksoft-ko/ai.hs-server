import express, { Request, Response } from 'express'
import { BadRequestError } from '@/errors/bad-request-error';
import Joi from 'joi';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import { requireAuth } from '@/middlewares/require-auth';
import { currentUser } from '@/middlewares/current-user';
import { User } from '@/models/user';
import { Settings, SettingsDoc } from '@/models/settings';

const router = express.Router();

interface SaveLockpwArgs {
  lockPw: string;
}

const schema = Joi.object<SaveLockpwArgs>({
  lockPw: Joi.string().required(),
})

router.get("/lockpw",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findOne({ userId: req.currentUser?.userId })
      .select("settings")
      .populate({
        path: "settings",
        select: "lockPw",
      });

    const lockPw = user?.settings?.lockPw ?? "0000";
    res.status(200).send({ lockPw })
  })

router.post(
  "/lockpw",
  currentUser,
  requireAuth,
  validateBody(schema),
  async (req: validateRequest<SaveLockpwArgs>, res: Response) => {
    const { lockPw } = req.body;
    const user = await User.findOne({ userId: req.currentUser?.userId }).select("settings")
    if (!user) {
      throw new BadRequestError("사용자 정보가 없습니다.")
    }
    let settings: SettingsDoc | null = null;
    if (user.settings) {
      settings = await Settings.findById(user.settings._id);
      if (settings) {
        settings.lockPw = lockPw;
        await settings.save();
      }
    }

    if (!settings) {
      settings = Settings.build({ lockPw });
      await settings.save();
      user.settings = settings._id;
      await user.save();
    }

    res.status(200).send({ lockPw: user.settings?.lockPw });
  }
);

export { router as settingsRouter }