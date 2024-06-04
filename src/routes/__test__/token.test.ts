import request from 'supertest'
import { app } from '../../app';
import { ValidateTokenDto } from '../token/dto/validate-token.dto';
import { testFindPw, testSignup } from '../../test/common';

const PATH = "/api/token";

describe(PATH, () => {
  it(`token - 비밀번호 찾기 후 토큰 확인`, async () => {
    await testSignup();
    const { token } = await testFindPw();

    const response = await request(app)
      .post(`/api/token/${token}/validate`)
      .send({ tokenType: 'changePw' } satisfies ValidateTokenDto)

    expect(response.body).toHaveProperty("token");
    expect(response.body.token).toEqual(token);

    // 없는 토큰 조회 테스트
    const response2 = await request(app)
      .post(`/api/token/${token}-error-token/validate`)
      .send({ tokenType: 'changePw' } satisfies ValidateTokenDto)

    expect(response2.body).toHaveProperty("message");
    expect(response2.body.message).toEqual("토큰이 만료되었습니다.");
  });
});