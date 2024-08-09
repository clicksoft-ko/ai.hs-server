import { DeskReason, DeskReasonDoc, ReasonSub } from "@/models/desk-reason";
import { DeskReasonSaveDto } from "../dto/desk_reason_save.dto";
import { BadRequestError } from "@/errors/bad-request-error";
import { DeskReasonUpdateAllDto } from "../dto/desk_reason_update_all.dto";
import { DeskReasonUpdateDto } from "../dto/desk_reason_update.dto";

class DeskReasonService {
  private sortReasonSubs(subs: ReasonSub[] | undefined) {
    if (!subs || subs.length === 0) return;

    subs.sort((a, b) => a.seq - b.seq);
    subs.forEach(sub => this.sortReasonSubs(sub.subs))
  }

  async findAll(userId: string): Promise<DeskReasonDoc[]> {
    const reasons = await DeskReason.find({ userId, $or: [{ doctorId: "" }, { doctorId: { $exists: false } }] }).sort({ seq: 1 });

    reasons.forEach(reason => {
      this.sortReasonSubs(reason.subs);
    })

    return reasons;
  }

  async findByDoctorId(userId: string, doctorId: string): Promise<DeskReasonDoc[]> {
    const reasons = doctorId ? await DeskReason.find({ userId, doctorId }).sort({ seq: 1 })
      : await this.findAll(userId);

    reasons.forEach(reason => {
      this.sortReasonSubs(reason.subs);
    })

    return reasons;
  }

  async save(userId: string, dto: DeskReasonSaveDto) {
    const reasons = await this.findByDoctorId(userId, dto.doctorId);

    if (reasons.some(r => r.text.toLowerCase() === dto.text.toLowerCase())) {
      throw new BadRequestError("이미 존재하는 내원사유입니다.");
    }

    if (reasons.some(r => r.useNHISHealthCheckUp) && dto.useNHISHealthCheckUp) {
      throw new BadRequestError("이미 공단검진이 등록되어 있습니다.");
    }

    const seqs = reasons.map(r => r.seq)
    const seq = seqs.length === 0 ? 1 : Math.max(...seqs) + 1;
    const newReason = DeskReason.build({
      userId,
      seq,
      ...dto,
    })
    return newReason.save();
  }

  async update(id: string, dto: DeskReasonUpdateDto) {
    return DeskReason.findOneAndUpdate({ _id: id }, { ...dto }, { new: true });
  }

  updateAll({ reasons }: DeskReasonUpdateAllDto) {
    const bulkOps = reasons.map(({ id, ...reason }) => ({
      updateOne: {
        filter: { _id: id },
        update: { ...reason }
      }
    }));

    return DeskReason.bulkWrite(bulkOps);
  }

  async delete(id: string) {
    return DeskReason.findOneAndDelete({ _id: id });
  }

  async deleteByDoctorId(doctorId: string) {
    return DeskReason.deleteMany({ doctorId });
  }
}

export const deskReasonService = new DeskReasonService();