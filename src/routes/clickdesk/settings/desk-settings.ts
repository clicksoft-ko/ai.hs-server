import { currentUser } from "@/middlewares/current-user";
import { requireAuth } from "@/middlewares/require-auth";
import { Request, Response, Router } from "express";
import { deskSettingsService } from "./service/desk-settings.service";
import { validateBody, validateRequest } from "@/middlewares/validate-body";
import { DeskSettingsFeatureUpdateDto, deskSettingsFeatureUpdateSchema } from "./dto/desk-settings-feature-update.dto";

const router = Router();

router.get(
  "/",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const settings = await deskSettingsService.findByUserId(req.currentUser!.userId);

    res.send(settings);
  }
);
router.put(
  "/feature",
  currentUser,
  requireAuth,
  validateBody(deskSettingsFeatureUpdateSchema),
  async (req: validateRequest<DeskSettingsFeatureUpdateDto>, res: Response) => {
    const updatedSettings = await deskSettingsService.updateSettings(req.currentUser!.userId, req.body);

    res.send(updatedSettings);
  }
);

export { router as clickdeskSettingsRouter };

