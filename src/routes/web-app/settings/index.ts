import { validateBody, validateRequest } from '@/middlewares/validate-body';
import express, { Request, Response } from 'express';
import { WebAppSettingsReadingDto, webAppSettingsReadingSchema } from './dto/web-app-settings-reading.dto';
import { webAppSettingsService } from './service/web-app-settings.service';
import { currentUser } from '@/middlewares/current-user';
import { requireAuth } from '@/middlewares/require-auth';

const router = express.Router();

router.get(
  "/:hsId/reading",
  async (req: Request, res: Response) => {
    const reading = await webAppSettingsService.getWebAppSettingsReading({ hsId: req.params.hsId })
    res.status(200).send(reading);
  }
);

router.put(
  "/:hsId/reading",
  currentUser,
  requireAuth,
  validateBody(webAppSettingsReadingSchema),
  async (req: validateRequest<WebAppSettingsReadingDto>, res: Response) => {
    const user = await webAppSettingsService.updateWebAppSettingsReading({ hsId: req.params.hsId, dto: req.body })

    res.status(200).send(user);
  }
);

export { router as webAppSettingsRouter };

