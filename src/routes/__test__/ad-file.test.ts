import request from 'supertest';
import { app } from '../../app';
import { testAdminSignupAndSignin } from '../../test/common';
import { AdFileSaveDto } from '../ad-file/dto/ad-file-save.dto';
const PATH = "/api/ad-file";

describe(PATH, () => {
  it(`광고 파일 저장, 조회, 삭제`, async () => {
    const { cookies } = await testAdminSignupAndSignin();

    // 첫 번째 데이터 추가
    let response = await request(app)
      .post(PATH)
      .send({ fileName: "test.png", fileType: 'image' } satisfies AdFileSaveDto)
      .set("Cookie", cookies);

    expect(response.body.fileName).toBe("test.png");
    expect(response.body.seq).toBe(1);

    // 두 번째 데이터 추가
    response = await request(app)
      .post(PATH)
      .send({ fileName: "test2.png", fileType: 'image' } satisfies AdFileSaveDto)
      .set("Cookie", cookies);

    expect(response.body.fileName).toBe("test2.png");
    expect(response.body.seq).toBe(2);

    // 데이터 조회
    response = await request(app)
      .get(PATH)
      .set("Cookie", cookies);

    expect(response.body.length).toBe(2);

    // 첫번째 정보 삭제
    response = await request(app)
      .delete(`${PATH}/${response.body[0].id}`)
      .set("Cookie", cookies);

    expect(response.body.fileName).toBe("test.png");
  });
});