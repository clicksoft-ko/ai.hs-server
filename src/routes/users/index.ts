import { currentUser } from '@/middlewares/current-user';
import { requireAdmin } from '@/middlewares/require-admin';
import { requireAuth } from '@/middlewares/require-auth';
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import express, { Request, Response } from 'express';
import Joi from 'joi';
import { ChangeEmailDto, ChangeEmailDtoSchema } from './dto/change-email.dto';
import { ChangePwDto, changePasswordDtoSchema as changePwDtoSchema } from './dto/change-pw.dto';
import { CheckPasswordDto } from './dto/check-password.dto';
import { FindPwDto, findPasswordDtoSchema } from './dto/find-pw.dto';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto';
import { usersService } from './service/users-service';

const router = express.Router();

const schema = Joi.object<CheckPasswordDto>({
  password: Joi.string().required(),
})
 
router.post(
  "/:userId/checkpw",
  validateBody(schema),
  async (req: validateRequest<CheckPasswordDto>, res: Response) => {
    await usersService.checkPassword({ userId: req.params.userId, password: req.body.password })

    res.status(200).send({});
  }
);

router.put(
  "/:userId/changepw",
  validateBody(changePwDtoSchema),
  async (req: validateRequest<ChangePwDto>, res: Response) => {
    await usersService.changePassword({ userId: req.params.userId, ...req.body })

    res.status(200).send({});
  }
);

router.put(
  "/change-email",
  currentUser,
  requireAuth,
  validateBody(ChangeEmailDtoSchema),
  async (req: validateRequest<ChangeEmailDto>, res: Response) => {
    await usersService.changeEmail({ userId: req.currentUser!.userId, email: req.body.email })
    res.status(200).send({});
  }
);

router.put(
  "/:userId/findpw",
  validateBody(findPasswordDtoSchema),
  async (req: validateRequest<FindPwDto>, res: Response) => {
    const { email, token } = await usersService.findPassword({ userId: req.params.userId, email: req.body.email })
    res.status(200).send({ email, token });
  }
);

router.get(
  "/",
  currentUser,
  requireAdmin,
  async (req: Request, res: Response) => {
    const users = await usersService.getAllUsers();

    res.status(200).send({ users });
  }
)

router.patch(
  "/:id",
  currentUser,
  requireAdmin,
  validateBody(updateUserSchema),
  async (req: validateRequest<UpdateUserDto>, res: Response) => {
    const id = req.params.id;
    const user = await usersService.update(id, req.body);

    res.status(200).send(user);
  }
)

router.delete(
  "/:id",
  currentUser,
  requireAdmin,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await usersService.delete(id);

    res.status(200).send(user);
  }
)

router.get(
  "/:userId/add-svcs",
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await usersService.getAdditionalServices(userId);

    res.status(200).send(user);
  }
)

export { router as usersRouter };
