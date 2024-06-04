import { User } from "@/models/user";
import { SaveLockPwDto } from "../dto/save-lock-pw.dto";
import { BadRequestError } from "@/errors/bad-request-error";
import { Settings, SettingsDoc } from "@/models/settings";

class SettingsService {
  async getLockPw(userId: string) {
    const user = await User.findOne({ userId })
      .select("settings")
      .populate({
        path: "settings",
        select: "lockPw",
      });

    return user?.settings?.lockPw ?? "0000";
  }

  async saveLockPw(userId: string, { lockPw }: SaveLockPwDto) {
    const user = await User.findOne({ userId }).select("settings")
    if (!user) {
      throw new BadRequestError("사용자 정보가 없습니다.")
    }
    let settings: SettingsDoc | null = null;
    if (user.settings) {
      settings = await Settings.findById(user.settings._id);
      if (settings) {
        settings.lockPw = lockPw;
        await settings.save();
      }
    }

    if (!settings) {
      settings = Settings.build({ lockPw });
      await settings.save();
      user.settings = settings;
      await user.save();
    }

    return user;
  }
}

export const settingsService = new SettingsService();