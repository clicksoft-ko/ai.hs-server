import express, { Request, Response } from 'express'
import Joi from 'joi';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import { requireAuth } from '@/middlewares/require-auth';
import { currentUser } from '@/middlewares/current-user';
import { settingsService } from './service/settings-service';

const router = express.Router();

interface SaveLockpwDto {
  lockPw: string;
}

const schema = Joi.object<SaveLockpwDto>({
  lockPw: Joi.string().required(),
})

router.get("/lockpw",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const lockPw = await settingsService.getLockPw(req.currentUser!.userId);
    res.status(200).send({ lockPw })
  })

router.post(
  "/lockpw",
  currentUser,
  requireAuth,
  validateBody(schema),
  async (req: validateRequest<SaveLockpwDto>, res: Response) => {
    const { lockPw } = req.body;
    const user = await settingsService.saveLockPw(req.currentUser!.userId, { lockPw })

    res.status(200).send({ lockPw: user.settings?.lockPw });
  }
);

export { router as settingsRouter }