import { DeskReasonDoc, ReasonState } from '@/models/desk-reason';
import request from 'supertest';
import { app } from '../../../app';
import { testAdminSignupAndSignin } from '../../../test/common';
import { fetchReasonsByDoctorId, saveReasonTest } from './common/reason-tests';
const PATH = "/api/clickdesk/reason";

describe(PATH, () => {
  async function fetchGetAll(cookies: string[]) {
    return await request(app)
      .get(PATH)
      .set("Cookie", cookies)
  }

  it(`reason 저장하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();

    const response = await saveReasonTest({ cookies, text: "문진표" });
    const response2 = await saveReasonTest({ cookies, text: "감기" });

    expect(response.body.seq).toBe(1);
    expect(response2.body.seq).toBe(2);
  });

  it(`reason 공단검진 체크 저장하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    let response = await saveReasonTest({ cookies, text: "건강검진", useNHISHealthCheckUp: true });
    let response2 = await saveReasonTest({ cookies, text: "건강검진2", useNHISHealthCheckUp: true });

    expect(response.status).toBe(200);
    expect(response2.status).toBe(400); // 공단검진은 내원사유에 하나만 작성이 가능

    response = await saveReasonTest({ cookies, text: "건강검진(a 의사)", useNHISHealthCheckUp: true, doctorId: 'a' });
    response2 = await saveReasonTest({ cookies, text: "건강검진2(a 의사)", useNHISHealthCheckUp: true, doctorId: 'a' });
    expect(response.status).toBe(200);
    expect(response2.status).toBe(400); // 의사별로 적용
  });

  it(`reason 모두 조회하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    await saveReasonTest({ cookies, text: "문진표" });
    await saveReasonTest({ cookies, text: "감기" });

    await saveReasonTest({ cookies, text: "A 테스트", doctorId: "a" });
    await saveReasonTest({ cookies, text: "A 테스트2", doctorId: "a" });
    await saveReasonTest({ cookies, text: "b 테스트", doctorId: "b" });

    let response = await fetchGetAll(cookies);

    let body: DeskReasonDoc[] = response.body;

    expect(body[0].text).toBe("문진표");
    expect(body[1].text).toBe("감기");

    // 특정 doctorId 조회하기
    response = await fetchReasonsByDoctorId(cookies, "a");
    body = response.body;
    expect(body[0].text).toBe("A 테스트");
    expect(body[1].text).toBe("A 테스트2");
  });

  it(`reason 삭제하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const saveRes = await saveReasonTest({ cookies, text: "문진표" });

    const delRes = await request(app)
      .delete(`${PATH}/${saveRes.body.id}`)
      .set("Cookie", cookies)

    const res = await fetchGetAll(cookies);
    expect(res.body.length).toBe(0);
  });

  it(`reason 단일 업데이트`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const res1 = await saveReasonTest({ cookies, text: "문진표" });

    const data1 = res1.body as ReasonState;
    data1.text = "문진표2";
    data1.seq = 2;

    const res = await request(app)
      .patch(`${PATH}/${data1.id}/update`)
      .send({ ...data1 } satisfies ReasonState)
      .set('Cookie', cookies);


    expect(res.body.text).toBe("문진표2");
    expect(res.body.seq).toBe(2);
  });

  it(`reason 다중 업데이트`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const res1 = await saveReasonTest({ cookies, text: "문진표" });
    const res2 = await saveReasonTest({ cookies, text: "감기" });
    const res3 = await saveReasonTest({ cookies, text: "기타" });

    const data1 = res1.body as ReasonState;
    data1.seq = 2;
    const data2 = res2.body as ReasonState;
    data2.seq = 3;
    const data3 = res3.body as ReasonState;
    data3.seq = 1;

    await request(app)
      .patch(`${PATH}/all`)
      .send({ reasons: [data1, data2, data3] as ReasonState[] })
      .set('Cookie', cookies);

    const res = await fetchGetAll(cookies);
    const reasons = res.body as ReasonState[]

    expect(reasons[0].text).toBe("기타");
    expect(reasons[1].text).toBe("문진표");
    expect(reasons[2].text).toBe("감기");
  });
});