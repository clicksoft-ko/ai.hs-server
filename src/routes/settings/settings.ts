import { currentUser } from '@/middlewares/current-user';
import { requireAuth } from '@/middlewares/require-auth';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import express, { Request, Response } from 'express';
import { SaveLockPwDto, saveLockpwDtoSchema } from './dto/save-lock-pw.dto';
import { settingsService } from './service/settings-service';

const router = express.Router();

router.get(
  "/lockpw",
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
  validateBody(saveLockpwDtoSchema),
  async (req: validateRequest<SaveLockPwDto>, res: Response) => {
    const { lockPw } = req.body;
    const user = await settingsService.saveLockPw(req.currentUser!.userId, { lockPw })

    res.status(200).send({ lockPw: user.settings?.questionnaire?.lockPw });
  }
);

// router.patch(
//   "/:id",
//   currentUser,
//   requireAuth,
//   validateBody(updateSettingsSchema),
//   async (req: validateRequest<UpdateSettingsDto>, res: Response) => {
//     const id = req.params.id;
//     const user = await settingsService.updateSettings(id, req.body);

//     res.status(200).send(user);
//   }
// );
export { router as settingsRouter };
