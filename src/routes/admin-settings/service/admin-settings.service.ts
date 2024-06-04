import { AdminSettings, AdminSettingsDoc } from "@/models/admin-settings";
import { SaveAdminSettingsDto } from "../dto/save-admin-settings.dto";
import { AdminSettingsResponseDto } from "../dto/admin-settings.dto";

class AdminSettingsService {
  async getManagerCode(): Promise<string | undefined> {
    const result = await AdminSettings.findOne().select("managerCode");

    return result?.managerCode;
  }

  async getAdminSettings(selectQuery?: string): Promise<AdminSettingsResponseDto> {
    const query = selectQuery
      ? AdminSettings.findOne().select(selectQuery)
      : AdminSettings.findOne()
    const result = await query;
    const doc = result?.toObject()

    return { ...doc }
  }

  async saveAdminSettings(dto: SaveAdminSettingsDto): Promise<AdminSettingsDoc> {
    let adminSettings = await AdminSettings.findOne() as AdminSettingsDoc;;

    if (!adminSettings) {
      adminSettings = AdminSettings.build({});
    }

    if (dto.managerCode) {
      adminSettings.managerCode = dto.managerCode;
    }

    return adminSettings.save();
  }
}

export const adminSettingsService = new AdminSettingsService();