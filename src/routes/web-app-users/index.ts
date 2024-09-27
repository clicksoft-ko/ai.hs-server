import express, { Request, Response } from 'express';
import { webAppUserService } from './service/web-app-users.service';

const router = express.Router();

router.get(
  "/:hsUserId",
  async (req: Request, res: Response) => {
    const hsUserId = req.params.hsUserId;
    const { users } = await webAppUserService.getWebAppUsers(hsUserId);
    
    res.status(200).send({ users });
  }
)

export { router as webAppUsersRouter };

