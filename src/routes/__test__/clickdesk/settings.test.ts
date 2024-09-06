import request from 'supertest';
import { app } from '@/app';
import { testAdminSignupAndSignin } from '@/test/common';
const PATH = "/api/clickdesk/settings";

describe(PATH, () => {
  it(`ClickDesk 설정 가져오기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const response = await request(app)
      .get(PATH)
      .set("Cookie", cookies);

    expect(response.status).toBe(200);
    expect(response.body.unUseQR).toBeDefined();
  });

  it(`ClickDesk 설정 업데이트`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const response = await request(app)
      .put(`${PATH}/feature`)
      .set("Cookie", cookies)
      .send({ unUseQR: true });

    expect(response.status).toBe(200);
    expect(response.body.unUseQR).toBe(true);

    const updateResponse = await request(app)
      .put(`${PATH}/feature`)
      .set("Cookie", cookies)
      .send({ unUseQR: false });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.unUseQR).toBe(false);
  });
});