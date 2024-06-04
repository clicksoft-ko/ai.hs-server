import { app } from '../../app';
import { testSignupAndSignin } from '../../test/common';
import request from 'supertest'
import { SaveLockPwDto } from '../settings/dto/save-lock-pw.dto';
const PATH = "/api/settings";

describe(PATH, () => {
  const saveLockPw = async () => {
    const cookie = await testSignupAndSignin();
    const response = await request(app)
      .post("/api/settings/lockpw")
      .send({ lockPw: "1234" } satisfies SaveLockPwDto)
      .set("Cookie", cookie)

    expect(response.body).toHaveProperty("lockPw");
    expect(response.body.lockPw).toEqual("1234");

    return {
      cookie,
      lockPw: response.body.lockPw,
    }
  }

  it(`잠금 비밀번호 저장하기`, async () => {
    await saveLockPw();
  });

  it(`잠금 비밀번호 저장 후 가져오기`, async () => {
    const { cookie, lockPw } = await saveLockPw();
    const response = await request(app)
      .get("/api/settings/lockpw")
      .set("Cookie", cookie)

    expect(response.body).toHaveProperty("lockPw");
    expect(response.body.lockPw).toEqual(lockPw);
  });
});