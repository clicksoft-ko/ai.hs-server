import { Router, Response } from "express";
import { SigninDto, signinSchema } from "./dto/signin.dto";
import { validateBody, validateRequest } from "../../middlewares/validate-body";
import { signinService } from "./service/signin-service";

const router = Router();

router.post("/",
  validateBody(signinSchema),
  async (req: validateRequest<SigninDto>, res: Response) => {
    const user = await signinService.signin({ ...req.body, res });

    res.status(200).send(user);
  }
);

export { router as signinRouter };
