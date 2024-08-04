import { app } from '../../../app';
import { testAdminSignupAndSignin } from '../../../test/common';
import request from 'supertest'
import { DeskDoctorSaveDto } from '../../clickdesk/doctor/dto/desk_doctor_save.dto';
import { DeskDoctorDeleteDto } from '../../clickdesk/doctor/dto/desk_doctor_delete.dto';
import { DeskDoctorUpdateSeqDto } from '../../clickdesk/doctor/dto/desk_doctor_update_seq.dto';
import { DeskDoctorUpdateDto } from '../../clickdesk/doctor/dto/desk_doctor_update.dto';

const PATH = "/api/clickdesk/doctor";

describe(PATH, () => {
  async function testSave({ code, name, cookies, seq = 1 }: { code: string, name: string, cookies: string[], seq?: number }) {
    const body: DeskDoctorSaveDto = {
      seq,
      code,
      name,
      jinchalName: "테스트",
      kwamokName: "내과",
    }
    const userResponse = await request(app)
      .put(PATH)
      .send(body)
      .set('Cookie', cookies);

    return userResponse;
  }

  async function testFindAll(cookies: string[]) {
    return request(app)
      .get(PATH)
      .send()
      .set('Cookie', cookies);
  }

  async function testFindOne(id: string, cookies: string[]) {
    return await request(app)
      .get(`${PATH}/${id}`)
      .send()
      .set('Cookie', cookies);
  }
  it(`deskDoctor 한명씩 조회하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const res1 = await testSave({ seq: 2, code: "A", name: "테스트A", cookies: cookies });
    const res2 = await testSave({ seq: 3, code: "B", name: "테스트B", cookies: cookies });

    const userResponse1 = await testFindOne(res1.body.id, cookies);

    expect(userResponse1.body.code).toBe("A");

    const userResponse2 = await testFindOne(res2.body.id, cookies);

    expect(userResponse2.body.code).toBe("B");
  });

  it(`deskDoctor 전체 조회하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    await testSave({ seq: 2, code: "A", name: "테스트A", cookies: cookies });
    await testSave({ seq: 3, code: "B", name: "테스트B", cookies: cookies });
    await testSave({ seq: 1, code: "C", name: "테스트C", cookies: cookies });

    const userResponse = await testFindAll(cookies);

    expect(userResponse.body).toBeInstanceOf(Array);
    expect(userResponse.body.length).toBe(3);
    expect(userResponse.body[0].seq).toBe(1);
    expect(userResponse.body[1].seq).toBe(2);
    expect(userResponse.body[2].seq).toBe(3);
    // expect(userResponse.body.name).toEqual("테스트 진료실");
  });

  it(`deskDoctor 저장하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const userResponse = await testSave({ code: "01", name: "테스트", cookies });

    expect(userResponse.body).toHaveProperty("name");
    expect(userResponse.body.name).toEqual("테스트");
  });

  it(`deskDoctor 같은 코드 저장 시 수정되는지 확인`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    await testSave({ code: "01", name: "테스트", cookies: cookies });
    const userResponse = await testSave({ code: "01", name: "테스트2", cookies: cookies });

    expect(userResponse.body).toHaveProperty("name");
    expect(userResponse.body.name).toEqual("테스트2");
  });

  it(`deskDoctor 삭제하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    await testSave({ code: "01", name: "테스트", cookies: cookies });

    const userResponse = await request(app)
      .delete(PATH)
      .send({ code: "01" } satisfies DeskDoctorDeleteDto)
      .set('Cookie', cookies);

    expect(userResponse.body).toHaveProperty("name");
    expect(userResponse.body.name).toEqual("테스트");
  });

  it(`deskDoctor 순번 변경하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const res1 = await testSave({ seq: 2, code: "A", name: "테스트A", cookies: cookies });
    const res2 = await testSave({ seq: 3, code: "B", name: "테스트B", cookies: cookies });
    const res3 = await testSave({ seq: 1, code: "C", name: "테스트C", cookies: cookies });
    res1
    const userResponse = await request(app)
      .patch(`${PATH}/seq`)
      .send({ codes: [{ code: "A", seq: 1 }, { code: "B", seq: 2 }, { code: "C", seq: 3 }] } satisfies DeskDoctorUpdateSeqDto)
      .set('Cookie', cookies);

    expect(userResponse.body).toHaveProperty("modifiedCount");
    expect(userResponse.body.modifiedCount).toEqual(3);

    const findResponse = await testFindAll(cookies);
    expect(findResponse.body.length).toBe(3);
    expect(findResponse.body[0].code).toBe("A");
    expect(findResponse.body[0].seq).toBe(1);
    expect(findResponse.body[1].code).toBe("B");
    expect(findResponse.body[1].seq).toBe(2);
  });

  it(`deskDoctor 업데이트하기`, async () => {
    const { cookies } = await testAdminSignupAndSignin();
    const res1 = await testSave({ seq: 2, code: "A", name: "테스트A", cookies: cookies });

    await request(app)
      .patch(`${PATH}/${res1.body.id}/update`)
      .send({
        name: "테스트B",
        jinchalName: "테스트B 진료실",
        kwamokName: "테스트 과목",
        works: {
          mon: [{
            start: { hour: 3, minute: 20 },
            end: { hour: 4, minute: 20 },
          }],
          tue: [

          ]
        },
      } satisfies DeskDoctorUpdateDto)
      .set('Cookie', cookies);


    const res = await testFindOne(res1.body.id, cookies);
    expect(res.body.name).toBe("테스트B");
  });
});