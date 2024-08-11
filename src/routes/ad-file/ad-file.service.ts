import { AdFile, AdFileType } from "@/models/ad-file";
import { AdFileSaveDto } from "./dto/ad-file-save.dto";

const userId = '';
class AdFileService {
  async getAll() {
    return AdFile.find({ userId }).sort({ seq: 1 });
  }

  async save(dto: AdFileSaveDto) {
    const result = await AdFile.aggregate([
      { $match: { userId } },
      { $group: { _id: null, maxSeq: { $max: "$seq" } } }
    ]);
    const maxSeq = result?.[0]?.maxSeq ?? 0;

    const adFile = AdFile.build({ userId, seq: maxSeq + 1, fileName: dto.fileName, fileType: dto.fileType as AdFileType, })
    return await adFile.save();
  }

  async delete(id: string) {
    return await AdFile.findByIdAndDelete(id);
  }
}

export const adFileService = new AdFileService();