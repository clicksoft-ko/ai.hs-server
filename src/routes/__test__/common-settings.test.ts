import { app } from '@/app';
import { testSignupAndSignin } from '@/test/common';
import request from 'supertest';

describe('Common Settings Routes', () => {
  describe('PUT /api/common-settings/ad-message', () => {
    it('returns 401 if user is not authenticated', async () => {
      await request(app)
        .put('/api/common-settings/ad-message')
        .send({
          message: 'Test Message',
          animationSeconds: 5
        })
        .expect(401);
    });
    it('adMessage 저장, 재 저장 및 불러오기', async () => {
      const { cookies } = await testSignupAndSignin();

      await request(app)
        .put('/api/common-settings/ad-message')
        .set('Cookie', cookies)
        .send({
          message: 'Test Message',
          animationSeconds: 5
        }).expect(200);

      // 다른 데이터로 재저장
      await request(app)
        .put('/api/common-settings/ad-message')
        .set('Cookie', cookies)
        .send({
          message: 'Test Message 2',
          animationSeconds: 10
        }).expect(200);

      const response = await request(app)
        .get('/api/common-settings/ad-message')
        .expect(200);

      // 재저장 후 불러오기
      expect(response.body).toEqual({
        message: 'Test Message 2',
        animationSeconds: 10
      });
    });
  });
});
