import { DeskDoctor, DoctorWorks, TimeRange, TimeValue } from "@/models/desk-doctor";
import { DeskDoctorSaveDto } from "../dto/desk_doctor_save.dto";
import { DeskDoctorUpdateSeqDto } from "../dto/desk_doctor_update_seq.dto";
import { DeskDoctorUpdateDto } from "../dto/desk_doctor_update.dto";
import { BadRequestError } from "@/errors/bad-request-error";
import { TimeOverlapUtil } from "../utils/time-overlap.util";
import { deskReasonService } from "../../reason/service/desk_reason_service";
import mongoose from "mongoose";

class DeskDoctorService {
  async update(id: string, dto: DeskDoctorUpdateDto) {
    const { works } = dto;
    for (const key in works) {
      const timeRanges = works?.[key as keyof DoctorWorks];

      if (timeRanges && TimeOverlapUtil.hasOverlappingRanges(timeRanges)) {
        throw new BadRequestError("시간을 겹치지 않게 입력해 주세요.", key);
      }
    }
    return DeskDoctor.findOneAndUpdate({ _id: id }, { ...dto }, { new: true })
  }

  async updateSeq(userId: string, { codes }: DeskDoctorUpdateSeqDto) {
    const bulkOps = codes.map(({ code, seq }) => ({
      updateOne: {
        filter: { userId, code },
        update: { seq },
      },
    }));

    return DeskDoctor.bulkWrite(bulkOps);
  }

  async findById(id: string) {
    return DeskDoctor.findById(id);
  }

  async findAll(userId: string) {
    return DeskDoctor.find({ userId }).sort({ seq: 1 });
  }

  async delete(userId: string, code: string) {
    const session = await mongoose.startSession();

    return await session.withTransaction(async (session) => {
      const doctor = await DeskDoctor.findOneAndDelete({ userId, code }, { session }).exec();
      if (doctor) {
        deskReasonService.deleteByDoctorId(doctor.id);
      }

      return doctor;
    }).finally(() => {
      session.endSession();
    });
  }

  async save(userId: string, dto: DeskDoctorSaveDto) {
    const doctor = await DeskDoctor.findOne({ userId, code: dto.code });

    if (doctor) {
      const updatedDoctor = DeskDoctor.findOneAndUpdate(
        { userId, code: dto.code }, { ...dto }, { new: true });
      return updatedDoctor;
    } else {
      const doctor = DeskDoctor.build({ ...dto, userId });
      return await doctor.save();
    }
  }
}

export const deskDoctorService = new DeskDoctorService();