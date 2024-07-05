import { currentUser } from "@/middlewares/current-user";
import { validateBody, validateRequest } from "@/middlewares/validate-body";
import { Router, Request, Response } from "express";
import { requireAuth } from "@/middlewares/require-auth";
import { DeskReasonSaveDto, deskReasonSaveSchema } from "./dto/desk_reason_save.dto";
import { deskReasonService } from "./service/desk_reason_service";
import { requireParams } from "@/middlewares/require-params";
import { DeskReasonUpdateAllDto, deskReasonUpdateAllSchema } from "./dto/desk_reason_update_all.dto";
import { DeskReasonUpdateDto, reasonUpdateSchema } from "./dto/desk_reason_update.dto";

const router = Router();

router.get(
  "/",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const data = await deskReasonService.findAll(req.currentUser!.userId);

    res.send(data);
  }
);

router.post(
  "/",
  currentUser,
  requireAuth,
  validateBody(deskReasonSaveSchema),
  async (req: validateRequest<DeskReasonSaveDto>, res: Response) => {
    const data = await deskReasonService.save(req.currentUser!.userId, req.body);

    res.send(data);
  }
);

router.patch(
  "/:id/update",
  currentUser,
  requireAuth,
  requireParams("id"),
  validateBody(reasonUpdateSchema),
  async (req: validateRequest<DeskReasonUpdateDto>, res: Response) => {
    const data = await deskReasonService.update(req.params.id, req.body);

    res.send(data);
  }
);

router.patch(
  "/all",
  currentUser,
  requireAuth,
  validateBody(deskReasonUpdateAllSchema),
  async (req: validateRequest<DeskReasonUpdateAllDto>, res: Response) => {
    const data = await deskReasonService.updateAll(req.body);

    res.send(data);
  }
);

router.delete(
  "/:id",
  currentUser,
  requireParams("id"),
  async (req: Request, res: Response) => {
    const data = await deskReasonService.delete(req.params.id);

    res.send(data);
  }
);


// router.get(
//   "/:id",
//   currentUser,
//   requireAuth,
//   async (req: Request, res: Response) => {
//     const id = req.params.id;
//     if (!id) throw new BadRequestError("아이디 값이 존재하지 않습니다.");

//     const data = await deskReasonService.findById(id);

//     res.send(data);
//   }
// );

// router.put(
//   "/",
//   currentUser,
//   requireAuth,
//   validateBody(deskReasonSaveSchema),
//   async (req: validateRequest<DeskReasonSaveDto>, res: Response) => {
//     const data = await deskReasonService.save(req.currentUser!.userId, req.body);

//     res.send(data);
//   }
// );

// router.patch(
//   "/:id/update",
//   currentUser,
//   requireAuth,
//   validateBody(deskReasonUpdateSchema),
//   async (req: validateRequest<DeskReasonUpdateDto>, res: Response) => {
//     const id = req.params.id;
//     if (!id) throw new BadRequestError("아이디 값이 존재하지 않습니다.");
//     const data = await deskReasonService.update(id, req.body);

//     res.send(data);
//   }
// );

// router.patch(
//   "/seq",
//   currentUser,
//   requireAuth,
//   validateBody(deskReasonUpdateSeqSchema),
//   async (req: validateRequest<DeskReasonUpdateSeqDto>, res: Response) => {
//     const data = await deskReasonService.updateSeq(req.currentUser!.userId, req.body);

//     res.send(data);
//   }
// );




export { router as clickdeskReasonRouter }