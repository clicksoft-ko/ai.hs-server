import { testSignupAndSignin } from '../../test/common';

const PATH = "/api/signin";

describe(PATH, () => {
  it(`계정 로그인 성공(200)`, async () => {
    const cookie = await testSignupAndSignin();

    expect(cookie.length).toBe(2);    
  });
});