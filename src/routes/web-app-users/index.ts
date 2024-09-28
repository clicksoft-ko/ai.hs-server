import { requireAuth } from '@/middlewares/require-auth';
import express, { Request, Response } from 'express';
import { webAppUserService } from './service/web-app-users.service';
import { currentUser } from '@/middlewares/current-user';

const router = express.Router();

router.get(
  "/:hsUserId",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const hsUserId = req.params.hsUserId;
    const { users } = await webAppUserService.getWebAppUsers(hsUserId);

    res.status(200).send({ users });
  }
)

router.delete(
  "/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const users = await webAppUserService.deleteWebAppUser(id);

    res.status(200).send(users);
  }
)

export { router as webAppUsersRouter };

