import { currentUser } from "@/middlewares/current-user";
import { validateBody, validateRequest } from "@/middlewares/validate-body";
import { Router, Request, Response } from "express";
import { DeskDoctorSaveDto, deskDoctorSaveSchema } from "./dto/desk_doctor_save.dto";
import { deskDoctorService } from "./service/desk_doctor.service";
import { DeskDoctorDeleteDto, deskDoctorDeleteSchema } from "./dto/desk_doctor_delete.dto";
import { DeskDoctorUpdateSeqDto, deskDoctorUpdateSeqSchema } from "./dto/desk_doctor_update_seq.dto";
import { requireAuth } from "@/middlewares/require-auth";
import { BadRequestError } from "@/errors/bad-request-error";
import { DeskDoctorUpdateDto, deskDoctorUpdateSchema } from "./dto/desk_doctor_update.dto";
import { DeskDoctorAttrs } from "@/models/desk-doctor";

const router = Router();

router.get(
  "/",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const data = await deskDoctorService.findAll(req.currentUser!.userId);

    res.send(data as DeskDoctorAttrs[]);
  }
);

router.get(
  "/:id",
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError("아이디 값이 존재하지 않습니다.");

    const data = await deskDoctorService.findById(id);

    res.send(data);
  }
);

router.put(
  "/",
  currentUser,
  requireAuth,
  validateBody(deskDoctorSaveSchema),
  async (req: validateRequest<DeskDoctorSaveDto>, res: Response) => {
    const data = await deskDoctorService.save(req.currentUser!.userId, req.body);

    res.send(data);
  }
);

router.patch(
  "/:id/update",
  currentUser,
  requireAuth,
  validateBody(deskDoctorUpdateSchema),
  async (req: validateRequest<DeskDoctorUpdateDto>, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequestError("아이디 값이 존재하지 않습니다.");
    const data = await deskDoctorService.update(id, req.body);

    res.send(data);
  }
);

router.patch(
  "/seq",
  currentUser,
  requireAuth,
  validateBody(deskDoctorUpdateSeqSchema),
  async (req: validateRequest<DeskDoctorUpdateSeqDto>, res: Response) => {
    const data = await deskDoctorService.updateSeq(req.currentUser!.userId, req.body);

    res.send(data);
  }
);

router.delete(
  "/",
  currentUser,
  validateBody(deskDoctorDeleteSchema),
  async (req: validateRequest<DeskDoctorDeleteDto>, res: Response) => {
    const data = await deskDoctorService.delete(req.currentUser!.userId, req.body.code);

    res.send(data);
  }
);



export { router as clickdeskDoctorRouter }