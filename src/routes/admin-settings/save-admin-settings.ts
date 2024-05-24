import { Router, Request, Response } from "express";
import { currentUser } from "../../middlewares/current-user";
import { requireAuth } from "../../middlewares/require-auth";
import { AdminSettings, AdminSettingsDoc } from "@/models/admin-settings";
import Joi from "joi";
import { validateBody, validateRequest } from "@/middlewares/validate-body";
import { requireAdmin } from "@/middlewares/require-admin";

const router = Router();

interface SaveAdminSettingsDto {
  managerCode?: string;
}

const shcema = Joi.object<SaveAdminSettingsDto>({
  managerCode: Joi.string().required(),
});

router.get(
  "/",
  currentUser,
  requireAdmin,
  async (req: Request, res: Response) => {
    let adminSettings = await AdminSettings.findOne() as AdminSettingsDoc;
    const doc = adminSettings.toObject();

    res.send({ ...doc });
  }
);

router.post(
  "/",
  currentUser,
  requireAdmin,
  validateBody(shcema),
  async (req: validateRequest<SaveAdminSettingsDto>, res: Response) => {
    let adminSettings = await AdminSettings.findOne() as AdminSettingsDoc;

    if (!adminSettings) {
      adminSettings = AdminSettings.build({})
    }

    const { managerCode } = req.body;
    if (managerCode) {
      adminSettings.managerCode = managerCode;
    }
    const savedData = await adminSettings.save();

    res.send({ data: savedData });
  }
);

export { router as adminSettingsRouter };
