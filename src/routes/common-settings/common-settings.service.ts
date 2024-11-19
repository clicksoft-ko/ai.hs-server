import { CommonSettings } from "@/models/common-settings";
import { CommonSettingsSaveDto } from "./dto/common-settings-save.dto";

class CommonSettingsService {
  async getAdMessage() {
    const commonSettings = await CommonSettings.findOne().select('adMessage');
    return commonSettings?.adMessage;
  }

  async saveAdMessage(attrs: CommonSettingsSaveDto) {
    const commonSettings = await CommonSettings.findOne();
    if (commonSettings) {
      commonSettings.set({ adMessage: attrs });
      await commonSettings.save();
      return commonSettings;
    }

    const newCommonSettings = CommonSettings.build({ adMessage: attrs });
    await newCommonSettings.save();
    return newCommonSettings;
  }
}

export const commonSettingsService = new CommonSettingsService();
