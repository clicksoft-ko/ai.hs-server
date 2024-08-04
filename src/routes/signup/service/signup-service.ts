import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";
import { SignupDto } from "../dto/signup.dto";
import { adminSettingsService } from "../../admin-settings/service/admin-settings.service";
import { NotAuthorizedError } from "@/errors/not-authorized-error";
import { randomUUID } from 'crypto'
import dayjs from "dayjs";
export default class SignupService {
  async signup(dto: SignupDto) {
    const { userId, password, orgName, email } = dto;
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      throw new BadRequestError("계정이 이미 존재합니다.", "userId");
    }

    let roomKey: string;
    while (true) {
      const uuid = randomUUID()
      roomKey = `${dayjs().format("YYYYMMDD")}-${uuid.split("-")[0]}`;

      const roomKeyExistingUser = await User.findOne({ roomKey });
      if (!roomKeyExistingUser) {
        break;
      }
    }

    const user = User.build({ userId, password, roomKey, orgName, email });
    await user.save();

    return user;
  }
}

export const signupService = new SignupService();
