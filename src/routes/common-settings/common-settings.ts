
import express, { Request, Response } from 'express';
import { commonSettingsService } from './common-settings.service';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import { requireAuth } from '@/middlewares/require-auth';
import { currentUser } from '@/middlewares/current-user';
import { CommonSettingsSaveDto, commonSettingsSaveSchema } from './dto/common-settings-save.dto';

const router = express.Router();

router.get(
  "/ad-message",
  async (req: Request, res: Response) => {
    const commonSettings = await commonSettingsService.getAdMessage();
    res.status(200).send(commonSettings);
  }
)

router.put(
  "/ad-message",
  currentUser,
  requireAuth,
  validateBody(commonSettingsSaveSchema),
  async (req: validateRequest<CommonSettingsSaveDto>, res: Response) => {
    const result = await commonSettingsService.saveAdMessage(req.body);
    res.status(200).send(result);
  }
)

export { router as commonSettingsRouter };
