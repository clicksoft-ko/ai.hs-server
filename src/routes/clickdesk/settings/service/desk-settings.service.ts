import { DeskSettings, DeskSettingsDoc } from "@/models/desk-settings";
import { DeskSettingsFeatureUpdateDto } from "../dto/desk-settings-feature-update.dto";

class DeskSettingsService {

  async #serializeSettings(settings: DeskSettingsDoc | undefined) {
    return {
      unUseQR: !!settings?.feature.unUseQR,
    }
  }

  async findByUserId(userId: string) {
    const result = await DeskSettings.findOne({ userId }).exec();

    return this.#serializeSettings(result || undefined);
  }

  async updateSettings(userId: string, body: DeskSettingsFeatureUpdateDto) {
    const settings = await DeskSettings.findOneAndUpdate(
      { userId },
      { $set: { "feature.unUseQR": body.unUseQR } },
      { new: true, upsert: true }
    ).exec() as DeskSettingsDoc;

    return this.#serializeSettings(settings);
  }
}

export const deskSettingsService = new DeskSettingsService();