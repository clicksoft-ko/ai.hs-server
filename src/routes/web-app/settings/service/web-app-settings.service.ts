import { WebAppSettings } from "@/models/web-app-settings";
import { WebAppSettingsReadingDto } from "../dto/web-app-settings-reading.dto";

export class WebAppSettingsService {
  async getWebAppSettingsReading({ hsId }: { hsId: string }): Promise<WebAppSettingsReadingDto> {
    const settings = await WebAppSettings.findOne({ hsId }, { reading: 1, _id: 0 });
    return settings
      ? {
        commonDays: settings.reading.commonDays,
        gumsaDays: settings.reading.gumsaDays,
      }
      : {
        commonDays: 90,
        gumsaDays: 90,
      };
  }

  async updateWebAppSettingsReading({ hsId, dto }: { hsId: string, dto: WebAppSettingsReadingDto }) {
    const reading = {
      commonDays: dto.commonDays,
      gumsaDays: dto.gumsaDays,
    };

    const settings = await WebAppSettings.findOneAndUpdate(
      { hsId },
      { reading },
      { upsert: true, new: true }
    );

    return settings.reading;
  }
}

export const webAppSettingsService = new WebAppSettingsService();