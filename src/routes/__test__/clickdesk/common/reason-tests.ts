import { app } from '@/app';
import { DeskReasonSaveDto } from '@/routes/clickdesk/reason/dto/desk_reason_save.dto';
import request from 'supertest'

const PATH = "/api/clickdesk/reason";

export async function saveReasonTest({ cookies, text, useNHISHealthCheckUp = false, doctorId = "" }: { cookies: string[], text: string, useNHISHealthCheckUp?: boolean, doctorId?: string }) {
  return request(app)
    .post(PATH)
    .send({ text, useNHISHealthCheckUp, doctorId } satisfies DeskReasonSaveDto)
    .set('Cookie', cookies);
}

export async function fetchReasonsByDoctorId(cookies: string[], doctorId: string) {
  return await request(app)
    .get(`${PATH}/${doctorId}`)
    .set("Cookie", cookies)
}