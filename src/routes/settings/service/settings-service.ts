import { User, UserAttrs, UserDoc } from "@/models/user";
import { SaveLockPwDto } from "../dto/save-lock-pw.dto";
import { BadRequestError } from "@/errors/bad-request-error";
import { Settings, SettingsAttrs, SettingsDoc } from "@/models/settings/settings";
import { UpdateSettingsDto } from "../dto/update-settings.dto";

class SettingsService {
  private async saveNewSettings(user: UserDoc, attrs: SettingsAttrs) {
    const settings = Settings.build(attrs);
    await settings.save();
    user.settings = settings;
    await user.save();
  }

  async getLockPw(userId: string) {
    const user = await User.findOne({ userId })
      .select("settings")
      .populate({
        path: "settings",
        select: "questionnaire",
      });

    return user?.settings?.questionnaire?.lockPw ?? "0000";
  }

  async saveLockPw(userId: string, { lockPw }: SaveLockPwDto) {
    const user = await User.findOne({ userId }).select("settings")
    if (!user) {
      throw new BadRequestError("사용자 정보가 없습니다.")
    }
    let settings: SettingsDoc | null = null;
    if (user.settings) {
      settings = await Settings.findById(user.settings._id);
      if (settings?.questionnaire) {
        settings.questionnaire.lockPw = lockPw;
        await settings.save();
      }
    }

    if (!settings?.questionnaire) {
      await this.saveNewSettings(user, { questionnaire: { lockPw } })
    }

    return user;
  }

  async updateSettings(user: UserDoc, dto: UpdateSettingsDto) {
    let settings: SettingsDoc | null = null;
    if (user.settings) {
      settings = await Settings.findById(user.settings);
      if (settings) {
        settings.questionnaire = { ...settings.questionnaire, ...dto.questionnaire };
        settings.webApp = { ...settings.webApp, ...dto.webApp };
        settings.clickDesk = { ...settings.clickDesk, ...dto.clickDesk };
        user.settings = await settings.save();
      }
    }

    if (!settings) {
      await this.saveNewSettings(user, { ...dto })
    }

    return user;
  }

  async delete(id: string) {
    return await Settings.findByIdAndDelete(id);
  }
}

export const settingsService = new SettingsService();