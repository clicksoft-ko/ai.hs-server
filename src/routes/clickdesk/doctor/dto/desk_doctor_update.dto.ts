import { DoctorWorks, TimeRange, TimeValue } from '@/models/desk-doctor'
import Joi from 'joi'

export interface DeskDoctorUpdateDto {
  name?: string;
  jinchalName?: string;
  kwamokName?: string;
  works?: DoctorWorks;
}

const timeValueSchema = Joi.object<TimeValue>({
  hour: Joi.number().required(),
  minute: Joi.number().required(),
});

const emptyArrayToUndefined = (value: any) => (Array.isArray(value) && value.length === 0 ? undefined : value);

const createDaySchema = (day: string) => {
  return Joi.array().items(
    Joi.object<TimeRange>({
      start: timeValueSchema.required().messages({
        'any.required': `${day}의 시작 시간을 입력해주세요`,
        'string.empty': `${day}의 시작 시간이 비어 있습니다`,
      }),
      end: timeValueSchema.required().messages({
        'any.required': `${day}의 종료 시간을 입력해주세요`,
        'string.empty': `${day}의 종료 시간이 비어 있습니다`,
      }),
    })
  ).custom(emptyArrayToUndefined);
};

const worksSchema = Joi.object({
  mon: createDaySchema("월요일"),
  tue: createDaySchema("화요일"),
  wed: createDaySchema("수요일"),
  thu: createDaySchema("목요일"),
  fri: createDaySchema("금요일"),
  sat: createDaySchema("토요일"),
  sun: createDaySchema("일요일"),
});

export const deskDoctorUpdateSchema = Joi.object<DeskDoctorUpdateDto>({
  jinchalName: Joi.string().min(1).messages({
    'string.empty': '진료실명칭을 입력해주세요.',
  }),
  name: Joi.string().min(1).messages({
    'string.empty': '의사명을 입력해주세요.',
  }),
  kwamokName: Joi.string().min(1).messages({
    'string.empty': '과목을 입력해주세요.',
  }),
  works: worksSchema,
});