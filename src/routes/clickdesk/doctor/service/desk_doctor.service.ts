import { DeskDoctor } from "@/models/desk_doctor";
import { DeskDoctorSaveDto } from "../dto/desk_doctor_save.dto";
import { DeskDoctorUpdateSeqDto } from "../dto/desk_doctor_update_seq.dto";
import { DeskDoctorUpdateDto } from "../dto/desk_doctor_update.dto";

class DeskDoctorService {
  async update(id: string, dto: DeskDoctorUpdateDto) {
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
    return DeskDoctor.findOneAndDelete({ userId, code });
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