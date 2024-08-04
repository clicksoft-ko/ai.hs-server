import { app } from '../../app';
import { testAdminSignupAndSignin } from '../../test/common';
import request from 'supertest'
import { SaveAdminSettingsDto } from '../admin-settings/dto/save-admin-settings.dto';
const PATH = "/api/admin-settings";

describe(PATH, () => {
  it(`admin 정보 저장하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();

    const userResponse = await request(app)
      .post(`/api/admin-settings`)
      .send({ managerCode: "admin_key" } satisfies SaveAdminSettingsDto)
      .set('Cookie', cookies);

    expect(userResponse.body).toHaveProperty("data");

    const { data } = userResponse.body;
    expect(data.managerCode).toEqual("admin_key"); // 유저 id가 test가 맞는지   
  });

  it(`admin 정보 가져오기`, async () => {
    const userResponse = await request(app)
      .post(`/api/admin-settings/find`)
      .send({ encKey: 'admin_key' });

    expect(userResponse.body).toEqual(expect.any(Object)); // 오브젝트 타입 체크
  });
});