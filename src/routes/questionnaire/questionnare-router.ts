import { Router, Request, Response } from "express";
import { validateBody, validateRequest } from "../../middlewares/validate-body";
import {
  IQuestionnaireDto,
  QuestionnaireSchema,
} from "./dto/questionnaire.dto";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send({ a: "asdas" });
});

router.post(
  "/",
  validateBody(QuestionnaireSchema),
  (req: validateRequest<IQuestionnaireDto>, res: Response) => {
    res.send({ a: "asdas" });
  }
);

export { router as questionnareRouter };
