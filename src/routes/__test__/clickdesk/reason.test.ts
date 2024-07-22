import { app } from '../../../app';
import { testAdminSignupAndSignin } from '../../../test/common';
import request from 'supertest'
import { DeskReasonSaveDto } from '../../clickdesk/reason/dto/desk_reason_save.dto';
import { DeskReasonDoc, ReasonState } from '../../../models/desk_reason'
const PATH = "/api/clickdesk/reason";

describe(PATH, () => {
  async function fetchSave({ cookies, text, useNHISHealthCheckUp = false }: { cookies: string[], text: string, useNHISHealthCheckUp?: boolean }) {
    return request(app)
      .post(`${PATH}`)
      .send({ text, useNHISHealthCheckUp } satisfies DeskReasonSaveDto)
      .set('Cookie', cookies);
  }

  async function fetchGetAll(cookies: string[]) {
    return await request(app)
      .get(PATH)
      .set("Cookie", cookies)
  }

  it(`reason 저장하기`, async () => {
    const cookies = await testAdminSignupAndSignin();

    const response = await fetchSave({ cookies, text: "문진표" });
    const response2 = await fetchSave({ cookies, text: "감기" });

    expect(response.body.seq).toBe(1);
    expect(response2.body.seq).toBe(2);
  });

  it(`reason 공단검진 체크 저장하기`, async () => {
    const cookies = await testAdminSignupAndSignin();
    const response = await fetchSave({ cookies, text: "건강검진", useNHISHealthCheckUp: true });
    const response2 = await fetchSave({ cookies, text: "건강검진2", useNHISHealthCheckUp: true });

    expect(response.body.seq).toBe(1);
    expect(response2.body.seq).toBe(2);
  });

  it(`reason 모두 조회하기`, async () => {
    const cookies = await testAdminSignupAndSignin();
    await fetchSave({ cookies, text: "문진표" });
    await fetchSave({ cookies, text: "감기" });


    const response = await fetchGetAll(cookies);

    const body: DeskReasonDoc[] = response.body;

    expect(body[0].text).toBe("문진표");
    expect(body[1].text).toBe("감기");
  });

  it(`reason 삭제하기`, async () => {
    const cookies = await testAdminSignupAndSignin();
    const saveRes = await fetchSave({ cookies, text: "문진표" });

    const delRes = await request(app)
      .delete(`${PATH}/${saveRes.body.id}`)
      .set("Cookie", cookies)

    const res = await fetchGetAll(cookies);
    expect(res.body.length).toBe(0);
  });

  it(`reason 단일 업데이트`, async () => {
    const cookies = await testAdminSignupAndSignin();
    const res1 = await fetchSave({ cookies, text: "문진표" });

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
    const cookies = await testAdminSignupAndSignin();
    const res1 = await fetchSave({ cookies, text: "문진표" });
    const res2 = await fetchSave({ cookies, text: "감기" });
    const res3 = await fetchSave({ cookies, text: "기타" });

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