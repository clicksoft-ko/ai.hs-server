import { currentUser } from '@/middlewares/current-user';
import { requireAdmin } from '@/middlewares/require-admin';
import express, { Request, Response } from 'express';
import { adFileService } from './ad-file.service';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import { AdFileSaveDto, adFileSaveScheam } from './dto/ad-file-save.dto';


const router = express.Router();

router.get(
  "/",
  async (req: Request, res: Response) => {
    const adFiles = await adFileService.getAll();
    res.status(200).send(adFiles);
  }
)

router.post(
  "/",
  currentUser,
  requireAdmin,
  validateBody(adFileSaveScheam),
  async (req: validateRequest<AdFileSaveDto>, res: Response) => {
    const result = await adFileService.save(req.body)
    res.status(201).send(result);
  }
);

router.delete("/:id",
  currentUser,
  requireAdmin,
  async (req: Request, res: Response) => {
    const result = await adFileService.delete(req.params.id)
    res.status(200).send(result);
  }
);
export { router as adFileRouter };
