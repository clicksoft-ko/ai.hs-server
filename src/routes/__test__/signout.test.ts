import { app } from '../../app';
import { testSignupAndSignin } from '../../test/common';
import request from 'supertest'
const PATH = "/api/signout";

describe(PATH, () => {
  it(`계정 로그아웃`, async () => {
    const response = await request(app)
      .post("/api/signout");
    const signoutCookie = response.headers['set-cookie'];

    // 로그아웃 시 user정보와 jwt초기화되는지
    expect(signoutCookie).toEqual([
      expect.stringContaining("user=; Max-Age=0; Path=/; Expires="),
      expect.stringContaining("jwt=; Max-Age=0; Path=/; Expires=")
    ]);
  });
});