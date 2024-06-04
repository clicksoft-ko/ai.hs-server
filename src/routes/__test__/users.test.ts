import request from 'supertest'
import { app } from '../../app';
import { TEST_USER_EMAIL, TEST_USER_ID, TEST_USER_PW, testAdminSignupAndSignin, testCurrentUser, testSignupAndSignin } from '../../test/common';
import { CheckPasswordDto } from '../users/dto/check-password.dto';
import { ChangePwDto } from '../users/dto/change-pw.dto';
import { User } from '../../models/user';
import bcrypt from 'bcrypt'
import { ChangeEmailDto } from '../users/dto/change-email.dto';
import { FindPwDto } from '../users/dto/find-pw.dto';

const PATH = "/api/users";

describe(PATH, () => {
  it(`checkpw - 비밀번호 확인 성공`, async () => {
    await testSignupAndSignin();
    await request(app)
      .post(`/api/users/${TEST_USER_ID}/checkpw`)
      .send({
        password: TEST_USER_PW
      } satisfies CheckPasswordDto)
      .expect(200);
  });

  it(`checkpw - 비밀번호 확인 실패`, async () => {
    await testSignupAndSignin();

    await request(app)
      .post(`/api/users/${TEST_USER_ID}/checkpw`)
      .send({
        password: "errorpw"
      } satisfies CheckPasswordDto)
      .expect(400);
  });

  it(`changepw - 비밀번호 변경`, async () => {
    await testSignupAndSignin();
    const newPw = "newpw";

    await request(app)
      .put(`/api/users/${TEST_USER_ID}/changepw`)
      .send({
        password: newPw
      } satisfies ChangePwDto)
      .expect(200);


    const user = await User.findOne({ userId: TEST_USER_ID })
    const passwordChanged = await bcrypt.compare(newPw, user!.password)
    expect(passwordChanged).toBe(true); // 비밀번호 변경 성공
  });

  it(`change-email - 이메일 변경`, async () => {
    const cookie = await testSignupAndSignin();
    const currentUser = await testCurrentUser(cookie);
    const newEmail = "newemail@newmail.com";

    expect(currentUser.email).toEqual(TEST_USER_EMAIL); // "test@test.com"

    await request(app)
      .put(`/api/users/change-email`)
      .send({
        email: newEmail
      } satisfies ChangeEmailDto)
      .set('Cookie', cookie)
      .expect(200);

    const user = await User.findOne({ userId: TEST_USER_ID })

    expect(user).toBeDefined();
    expect(user!.email).toEqual(newEmail);
  });

  it(`findpw - 비밀번호 찾기`, async () => {
    const cookie = await testSignupAndSignin();
    const currentUser = await testCurrentUser(cookie);

    const response = await request(app)
      .put(`/api/users/${currentUser.userId}/findpw`)
      .send({
        email: TEST_USER_EMAIL,
      } satisfies FindPwDto)
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body?.email).toEqual(TEST_USER_EMAIL);
  });

  it(`get - 모든 유저 가져오기`, async () => {
    const cookie = await testAdminSignupAndSignin();
    const response = await request(app)
      .get(`/api/users`)
      .set('Cookie', cookie)
      .expect(200); 

    expect(response.body).toHaveProperty("users");
    const users = response.body.users;
    expect(response.body.users).toEqual(expect.any(Array));
    const user = users[0];
    expect(user).toHaveProperty('admin');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('orgName');
    expect(user).toHaveProperty('roomKey');
    expect(user).toHaveProperty('updatedAt');
    expect(user).toHaveProperty('userId');
  });
});