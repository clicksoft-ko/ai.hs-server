import { Router, Request, Response } from "express";
import {
  IQuestionnaireDto,
  QuestionnaireSchema,
} from "./dto/questionnaire.dto";
import { validateBody, validateRequest } from "@/middlewares/validate-body";

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
