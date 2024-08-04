import { ReasonState, ReasonSub } from "@/models/desk-reason";
import Joi from "joi";
import { reasonUpdateSchema } from "./desk_reason_update.dto";

export interface DeskReasonUpdateAllDto {
  reasons: ReasonState[];
}

export const deskReasonUpdateAllSchema = Joi.object<DeskReasonUpdateAllDto>({
  reasons: Joi.array().items(reasonUpdateSchema),
});