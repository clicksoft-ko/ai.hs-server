import { Router, Response } from "express";
import { SignupDto, signupSchema } from "./dto/signup.dto";
import { validateBody, validateRequest } from "../../middlewares/validate-body";
import { signupService } from "./service/signup-service";

const router = Router();

router.post("/",
  validateBody(signupSchema),
  async (req: validateRequest<SignupDto>, res: Response) => {
    const user = await signupService.signup(req.body);
    res.status(201).send(user);
  }
);

export { router as signupRouter };
