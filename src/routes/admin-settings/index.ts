import { Router, Request, Response } from "express";
import { currentUser } from "../../middlewares/current-user";
import Joi from "joi";
import { validateBody, validateRequest } from "@/middlewares/validate-body";
import { requireAdmin } from "@/middlewares/require-admin";
import { SaveAdminSettingsDto } from "./dto/save-admin-settings.dto";
import { adminSettingsService } from "./service/admin-settings.service";
import { AdminSettingsDto } from "./dto/admin-settings.dto";
import { NotAuthorizedError } from "@/errors/not-authorized-error";

const router = Router();

router.post(
  "/find",
  async (req: Request, res: Response) => {
    const { encKey } = req.body as AdminSettingsDto;
    if (encKey && encKey !== process.env.ADMIN_KEY!) {
      throw new NotAuthorizedError();
    }
    const { selectQuery } = req.query;
    const data = await adminSettingsService.getAdminSettings(selectQuery as string);

    res.send(data);
  }
);

const schema = Joi.object<SaveAdminSettingsDto>({
  managerCode: Joi.string(),
});

router.post(
  "/",
  currentUser,
  requireAdmin,
  validateBody(schema),
  async (req: validateRequest<SaveAdminSettingsDto>, res: Response) => {
    const savedData = await adminSettingsService.saveAdminSettings(req.body)
    res.send({ data: savedData });
  }
);

export { router as adminSettingsRouter };
