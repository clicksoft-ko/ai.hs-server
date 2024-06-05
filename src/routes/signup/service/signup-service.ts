import { User } from "../../../models/user";
import { BadRequestError } from "../../../errors/bad-request-error";
import { SignupDto } from "../dto/signup.dto";
import { adminSettingsService } from "../../admin-settings/service/admin-settings.service";
import { NotAuthorizedError } from "@/errors/not-authorized-error";

export default class SignupService {
  async signup(dto: SignupDto) {
    const { userId, password, orgName, email, roomKey, managerCode } = dto;
    const existingUser = await User.findOne({ userId });
    const confirmManagerCode = await adminSettingsService.getManagerCode();

    if (confirmManagerCode !== managerCode) {
      throw new NotAuthorizedError();
    }

    if (existingUser) {
      throw new BadRequestError("계정이 이미 존재합니다.", "userId");
    }

    const roomKeyExistingUser = await User.findOne({ roomKey });
    if (roomKeyExistingUser && roomKey.toLowerCase() === roomKeyExistingUser.roomKey) {
      throw new BadRequestError("이미 존재하는 연결 코드입니다.", "roomKey");
    }
    
    const user = User.build({ userId, password, roomKey, orgName, email });
    await user.save();

    return user;
  }
}

export const signupService = new SignupService();
