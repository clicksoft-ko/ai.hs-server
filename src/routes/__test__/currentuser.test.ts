import { app } from '../../app';
import { testSignupAndSignin } from '../../test/common';
import request from 'supertest'
const PATH = "/api/currentuser";

describe(PATH, () => {
  it(`로그인 되어있는 유저 가져오기`, async () => {
    const signinCookie = await testSignupAndSignin();

    expect(signinCookie.length).toBe(2); // 로그인 JWT 생성 성공

    const userResponse = await request(app) // 로그인 쿠키로 유저 정보 가져오기
      .post("/api/currentuser")
      .set("Cookie", signinCookie);

    expect(userResponse.body).toHaveProperty("currentUser");  // 유저 정보가 올바르게 받아와졌는지

    const { currentUser } = userResponse.body;
    expect(currentUser.userId).toEqual("test"); // 유저 id가 test가 맞는지   
  });
});