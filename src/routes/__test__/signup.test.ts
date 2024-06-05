import request from 'supertest'
import { app } from '../../app'
import { testSignup } from '../../test/common';

const PATH = "/api/signup";

describe(PATH, () => {

  it(`계정 생성(201)`, async () => {
    await testSignup();
  });

  it(`같은 계정으로 두번 생성 실패(400)`, async () => {
    await testSignup();

    await request(app).post(PATH)
      .send({
        userId: "test",
        password: "1234",
        email: "test@test.com",
        orgName: "clicksoft",
        roomKey: "abc123",
        managerCode: "abc",
      }).expect(400);
  });

  it(`Email 누락(400)`, async () => {
    const response = await request(app).post(PATH)
      .send({
        userId: "test",
        password: "1234",
        orgName: "clicksoft",
        roomKey: "abc123",
        managerCode: "abc",
      })
      .expect(400);

    expect(response.body.error).toHaveProperty('email');
  });

  it(`같은 연결 코드(roomKey) 체크`, async () => {
    await testSignup();

    await request(app).post(PATH)
      .send({
        userId: "newTest",
        password: "1234",
        email: "newtest@test.com",
        orgName: "newsoft",
        roomKey: "abc123",
        managerCode: "abc",
      }).expect(400);
  });
});