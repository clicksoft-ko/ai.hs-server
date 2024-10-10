import request from 'supertest';
import { app } from '../../app';
import { testAdminSignupAndSignin } from '../../test/common';
import { WebAppSettingsReadingDto } from '../web-app/settings/dto/web-app-settings-reading.dto';

const PATH = "/api/web-app/settings";

describe(PATH, () => {
  it('웹앱 Reading 설정 업데이트', async () => {
    const { user, cookies } = await testAdminSignupAndSignin();

    let webAppSettingsDto: WebAppSettingsReadingDto = {
      commonDays: 7,
      gumsaDays: 14
    };

    const response = await request(app)
      .put(`${PATH}/${user.id}/reading`)
      .set('Cookie', cookies)
      .send(webAppSettingsDto);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(webAppSettingsDto);

    // 새로운 데이터로 업데이트
    webAppSettingsDto = {
      commonDays: 30,
      gumsaDays: 80
    };

    const updatedResponse = await request(app)
      .put(`${PATH}/${user.id}/reading`)
      .set('Cookie', cookies)
      .send(webAppSettingsDto);

    expect(updatedResponse.status).toBe(200);
    expect(updatedResponse.body).toMatchObject(webAppSettingsDto);

    // 데이터 조회
    const getResponse = await request(app)
      .get(`${PATH}/${user.id}/reading`)
      .set('Cookie', cookies);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(webAppSettingsDto);
  });

  it('잘못된 웹앱 설정 데이터로 업데이트 시도', async () => {
    const { user, cookies } = await testAdminSignupAndSignin();

    const invalidWebAppSettingsDto = {
      commonDays: 'invalid', // 숫자여야 함
      gumsaDays: 14
    };

    const response = await request(app)
      .put(`${PATH}/${user.id}/reading`)
      .set('Cookie', cookies)
      .send(invalidWebAppSettingsDto);

    expect(response.status).toBe(400);
  });
});
