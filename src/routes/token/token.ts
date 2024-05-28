import express, { Request, Response } from 'express'
import { validateBody, validateRequest } from '@/middlewares/validate-body';
import { ValidateTokenDto, validateTokenDtoSchema } from './dto/validate-token.dto';
import { tokenService } from './service/token-service';

const router = express.Router();

router.post(
  "/:token/validate",
  validateBody(validateTokenDtoSchema),
  async (req: validateRequest<ValidateTokenDto>, res: Response) => {
    const { tokenType } = req.body;
    const token = await tokenService.validateToken({ token: req.params.token, tokenType });

    res.status(200).send(token);
  }
)
export { router as tokenRouter }