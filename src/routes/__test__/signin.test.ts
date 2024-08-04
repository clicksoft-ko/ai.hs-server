import { testSignupAndSignin } from '../../test/common';

const PATH = "/api/signin";

describe(PATH, () => {
  it(`계정 로그인 성공(200)`, async () => {
    const {cookies} = await testSignupAndSignin();

    expect(cookies.length).toBe(2);    
  });
});