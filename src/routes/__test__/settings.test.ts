import request from 'supertest';
import { app } from '../../app';
import { testSignupAndSignin } from '../../test/common';
import { SaveLockPwDto } from '../settings/dto/save-lock-pw.dto';
import { UpdateSettingsDto } from '../settings/dto/update-settings.dto';
const PATH = "/api/settings";

describe(PATH, () => {
  const saveLockPw = async () => {
    const { cookies } = await testSignupAndSignin();
    const response = await request(app)
      .post("/api/settings/lockpw")
      .send({ lockPw: "1234" } satisfies SaveLockPwDto)
      .set("Cookie", cookies)

    expect(response.body).toHaveProperty("lockPw");
    expect(response.body.lockPw).toEqual("1234");

    return {
      cookies,
      lockPw: response.body.lockPw,
    }
  }

  it(`잠금 비밀번호 저장하기`, async () => {
    await saveLockPw();
  });

  it(`잠금 비밀번호 저장 후 가져오기`, async () => {
    const { cookies, lockPw } = await saveLockPw();
    const response = await request(app)
      .get("/api/settings/lockpw")
      .set("Cookie", cookies)

    expect(response.body).toHaveProperty("lockPw");
    expect(response.body.lockPw).toEqual(lockPw);
  });

  // it(`설정 전체 저장`, async () => {
  //   const { user, cookies } = await testSignupAndSignin();
  //   const requestBody: UpdateSettingsDto = {
  //     clickDesk: { use: true },
  //     questionnaire: { use: true, lockPw: "1234" },
  //     webApp: { use: true }
  //   };
  //   const response = await request(app)
  //     .patch(`/api/settings/${user.id}`)
  //     .set("Cookie", cookies)
  //     .send(requestBody);

  //   expect(response.status).toBe(200); // 상태 코드가 200인지 확인
  //   expect(response.body.settings).toMatchObject(requestBody);
  // });
});