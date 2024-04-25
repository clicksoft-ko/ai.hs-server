import { Router, Request, Response } from "express";
import { QuestionnaireSchema } from "../joi/questionnaire";
import { JoyError } from "../errors/joy-error";

const router = Router(); 

router.get("/", (req: Request, res: Response) => {
  res.send({ a: "asdas" });
});

router.post("/", (req: Request, res: Response) => {
  const { error, value } = QuestionnaireSchema.validate(req.body);
  if (error) {
    throw new JoyError(error);
    // console.log("err------------------------------");
    // console.log(error.details);
    // console.log("------------------------------");
  } else {
    console.log("val------------------------------");
    console.log(value);

    console.log("------------------------------");
  }

  res.send({ a: "asdas" });
});

export { router as questionnareRouter };

// function questionnareSerializer(
//   q: Partial<QuestionnaireType>
// ): QuestionnaireType {
//   const n1 = q.history?.n1;
//   const n2 = q.history?.n2;
//   const data: QuestionnaireType = {
//     history: {
//       n1: {
//         angina: {
//           diagnosis: n1?.angina?.diagnosis ?? false,
//           drugTherapy: n1?.angina?.drugTherapy ?? false,
//         },
//         diabetes: {
//           diagnosis: n1?.diabetes?.diagnosis ?? false,
//           drugTherapy: n1?.diabetes?.drugTherapy ?? false,
//         },
//         dyslipidemia: {
//           diagnosis: n1?.dyslipidemia?.diagnosis ?? false,
//           drugTherapy: n1?.dyslipidemia?.drugTherapy ?? false,
//         },
//         hypertension: {
//           diagnosis: n1?.hypertension?.diagnosis ?? false,
//           drugTherapy: n1?.hypertension?.drugTherapy ?? false,
//         },
//         others: {
//           diagnosis: n1?.others?.diagnosis ?? false,
//           drugTherapy: n1?.others?.drugTherapy ?? false,
//         },
//         PT: {
//           diagnosis: n1?.PT?.diagnosis ?? false,
//           drugTherapy: n1?.PT?.drugTherapy ?? false,
//         },
//         stroke: {
//           diagnosis: n1?.stroke?.diagnosis ?? false,
//           drugTherapy: n1?.stroke?.drugTherapy ?? false,
//         },
//       },
//       n2: {
//         angina: n2?.angina ?? false,
//         diabetes: n2?.diabetes ?? false,
//         hypertension: n2?.hypertension ?? false,
//         others: n2?.others ?? false,
//         stroke: n2?.stroke ?? false,
//       },
//       n3: q.history?.n3!,
//     },
//     smoking: {
//       n4: q.smoking?.n4,
//     },
//   };
// }
