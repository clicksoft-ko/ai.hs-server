import request from 'supertest'
import { app } from '../../app';
import { TEST_USER_EMAIL, TEST_USER_ID, TEST_USER_PW, testAdminSignupAndSignin, testCurrentUser, testSignupAndSignin } from '../../test/common';
import { CheckPasswordDto } from '../users/dto/check-password.dto';
import { ChangePwDto } from '../users/dto/change-pw.dto';
import { User, UserAttrs } from '../../models/user';
import bcrypt from 'bcrypt'
import { ChangeEmailDto } from '../users/dto/change-email.dto';
import { FindPwDto } from '../users/dto/find-pw.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

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
    const { cookies } = await testSignupAndSignin();
    const currentUser = await testCurrentUser(cookies);
    const newEmail = "newemail@newmail.com";

    expect(currentUser.email).toEqual(TEST_USER_EMAIL); // "test@test.com"

    await request(app)
      .put(`/api/users/change-email`)
      .send({
        email: newEmail
      } satisfies ChangeEmailDto)
      .set('Cookie', cookies)
      .expect(200);

    const user = await User.findOne({ userId: TEST_USER_ID })

    expect(user).toBeDefined();
    expect(user!.email).toEqual(newEmail);
  });

  it(`findpw - 비밀번호 찾기`, async () => {
    const { cookies } = await testSignupAndSignin();
    const currentUser = await testCurrentUser(cookies);

    const response = await request(app)
      .put(`/api/users/${currentUser.userId}/findpw`)
      .send({
        email: TEST_USER_EMAIL,
      } satisfies FindPwDto)
      .set('Cookie', cookies)
      .expect(200);

    expect(response.body?.email).toEqual(TEST_USER_EMAIL);
  });

  it(`get - 모든 유저 가져오기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const response = await request(app)
      .get(`/api/users`)
      .set('Cookie', cookies)
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

  it(`사용자 정보 및 설정 수정`, async () => {
    const { user, cookies } = await testAdminSignupAndSignin();
    const requestBody: UpdateUserDto = {
      email: "abc@abc.com",
      orgName: "abc소프트",
      settings: {
        clickDesk: { use: true },
        questionnaire: { use: true, lockPw: "1234" },
        webApp: { use: true }
      }
    };
    const response = await request(app)
      .patch(`/api/users/${user.id}`)
      .set("Cookie", cookies)
      .send(requestBody);

    expect(response.status).toBe(200); // 상태 코드가 200인지 확인
    expect(response.body).toMatchObject(requestBody);

    // 다시 다른 값으로 업데이트
    const requestBody2: UpdateUserDto = {
      email: "abc2@abc.com",
      orgName: "abc2소프트",
      settings: {
        clickDesk: { use: false },
        questionnaire: { use: true, lockPw: "2222" },
        webApp: { use: true }
      }
    };
    const response2 = await request(app)
      .patch(`/api/users/${user.id}`)
      .set("Cookie", cookies)
      .send(requestBody2);

    expect(response2.status).toBe(200); // 상태 코드가 200인지 확인
    expect(response2.body).toMatchObject(requestBody2);
  });

  it(`사용자 정보 추가 및 삭제`, async () => {
    const { user, cookies } = await testAdminSignupAndSignin();
    const requestBody: UpdateUserDto = {
      email: "abc@abc.com",
      orgName: "abc소프트",
      settings: {
        clickDesk: { use: true },
        questionnaire: { use: true, lockPw: "1234" },
        webApp: { use: true }
      }
    };

    await request(app)
      .patch(`/api/users/${user.id}`)
      .set("Cookie", cookies)
      .send(requestBody);

    // 삭제 요청
    const response = await request(app)
      .delete(`/api/users/${user.id}`)
      .set("Cookie", cookies);

    const deletedUser: UserAttrs = response.body;
    expect(deletedUser).toMatchObject(requestBody);
  })
});