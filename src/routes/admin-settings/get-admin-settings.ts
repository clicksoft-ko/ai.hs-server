import { Router, Request, Response } from "express";
import { currentUser } from "../../middlewares/current-user";
import { AdminSettings, AdminSettingsDoc } from "@/models/admin-settings";
import { requireAdmin } from "@/middlewares/require-admin";

const router = Router();

router.get(
  "/",
  currentUser,
  requireAdmin,
  async (req: Request, res: Response) => {
    let adminSettings = await AdminSettings.findOne() as AdminSettingsDoc;

    res.send({ adminSettings });
  }
);

export { router as adminSettingsRouter };
