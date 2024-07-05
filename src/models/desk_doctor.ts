import mongoose from "mongoose";

export interface DeskDoctorAttrs {
  userId: string;
  seq: number;
  code: string;
  name: string;
  jinchalName: string;
  kwamokName: string;
  works?: DoctorWorks;
}

export interface DoctorWorks {
  mon?: TimeRange[];
  tue?: TimeRange[];
  wed?: TimeRange[];
  thu?: TimeRange[];
  fri?: TimeRange[];
  sat?: TimeRange[];
  sun?: TimeRange[];
}

export interface TimeRange {
  start: TimeValue,
  end: TimeValue;
}

export interface TimeValue {
  hour: number;
  minute: number;
}

export interface DeskDoctorModel extends mongoose.Model<DeskDoctorDoc> {
  build(attrs: DeskDoctorAttrs): DeskDoctorDoc;
}

export interface DeskDoctorDoc extends mongoose.Document, DeskDoctorAttrs { }

const timeValueSchema = new mongoose.Schema(
  {
    hour: { type: Number, required: true },
    minute: { type: Number, required: true },
  },
  { _id: false }
);

const timeRangeSchema = new mongoose.Schema(
  {
    start: { type: timeValueSchema, required: true },
    end: { type: timeValueSchema, required: true },
  },
  { _id: false }
);

const doctorWorksSchema = new mongoose.Schema(
  {
    mon: { type: [timeRangeSchema], required: false },
    tue: { type: [timeRangeSchema], required: false },
    wed: { type: [timeRangeSchema], required: false },
    thu: { type: [timeRangeSchema], required: false },
    fri: { type: [timeRangeSchema], required: false },
    sat: { type: [timeRangeSchema], required: false },
    sun: { type: [timeRangeSchema], required: false },
  },
  { _id: false }
);

const deskDoctorSchema = new mongoose.Schema<DeskDoctorAttrs, DeskDoctorModel>(
  {
    userId: { type: String, required: true },
    seq: { type: Number, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    jinchalName: { type: String, required: true },
    kwamokName: { type: String, required: true },
    works: { type: doctorWorksSchema, required: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

deskDoctorSchema.statics.build = (attrs: DeskDoctorAttrs) => {
  return new DeskDoctor(attrs);
};

const DeskDoctor = mongoose.model<DeskDoctorAttrs, DeskDoctorModel>("DeskDoctor", deskDoctorSchema);

export { DeskDoctor };
