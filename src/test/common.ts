
import request from 'supertest'
import { SignupDto } from '../routes/signup/dto/signup.dto';
import { app } from '../app';
import { FindPwDto } from '../routes/users/dto/find-pw.dto';
import { User } from '../models/user';
import { SigninDto } from '../routes/signin/dto/signin.dto';

export const TEST_USER_ID = "test";
export const TEST_USER_PW = "1234";
export const TEST_USER_EMAIL = "test@test.com";

export const testSignup = async (isAdmin: boolean = false) => {
  await request(app)
    .post("/api/signup")
    .send({
      userId: TEST_USER_ID,
      password: TEST_USER_PW,
      email: TEST_USER_EMAIL,
      orgName: "clicksoft",
      roomKey: "abc123",
      managerCode: "abc",
    } satisfies SignupDto);

  if (isAdmin) {
    const user = await User.findOne({ userId: TEST_USER_ID });
    if (user) {
      user.admin = true;
      await user.save();
    }
  }
};

export const testSignin = async (): Promise<string[]> => {
  const response = await request(app)
    .post("/api/signin")
    .send({
      userId: TEST_USER_ID,
      password: TEST_USER_PW,
    } satisfies SigninDto);

  const cookie = response.headers['set-cookie'] as any;
  return cookie as string[];
}

export const testSignupAndSignin = async (): Promise<string[]> => {
  await testSignup();
  return testSignin();
}

export const testAdminSignupAndSignin = async (): Promise<string[]> => {
  await testSignup(true);
  return testSignin();
}

export const testCurrentUser = async (cookie: string[]) => {
  const userResponse = await request(app) // 로그인 쿠키로 유저 정보 가져오기
    .post("/api/currentuser")
    .set("Cookie", cookie);

  const { currentUser } = userResponse.body;
  return currentUser;
}

export const testFindPw = async () => {
  const response = await request(app)
    .put(`/api/users/${TEST_USER_ID}/findpw`)
    .send({
      email: TEST_USER_EMAIL,
    } satisfies FindPwDto)
    .expect(200);

  expect(response.body).toHaveProperty("token");
  expect(response.body?.email).toEqual(TEST_USER_EMAIL);

  return { token: response.body.token };
}