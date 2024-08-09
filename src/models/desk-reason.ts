import mongoose, { Schema } from "mongoose";

export interface ReasonState extends DeskReasonAttrs {
  id: string;
}

export interface DeskReasonAttrs extends ReasonSub {
  userId: string;
  useNHISHealthCheckUp: boolean;
  doctorId: string;
}

export interface ReasonSub {
  seq: number;
  text: string;
  subs?: ReasonSub[];
}

export interface DeskReasonModel extends mongoose.Model<DeskReasonDoc> {
  build(attrs: DeskReasonAttrs): DeskReasonDoc;
}

export interface DeskReasonDoc extends mongoose.Document, DeskReasonAttrs { }

const reasonSubSchema = new mongoose.Schema<ReasonSub>(
  {
    seq: { type: Number, required: true },
    text: { type: String, required: true },
    subs: { type: [{ type: mongoose.Schema.Types.Mixed }], required: false }
  },
  { _id: false }
);

const reasonSchema = new mongoose.Schema<DeskReasonAttrs, DeskReasonModel>(
  {
    userId: { type: String, required: true },
    useNHISHealthCheckUp: { type: Boolean, required: true },
    doctorId: { type: String, default: "" },
    seq: { type: Number, required: true },
    text: { type: String, required: true },
    subs: { type: [reasonSubSchema], required: false },
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

reasonSchema.statics.build = (attrs: DeskReasonAttrs) => {
  return new DeskReason(attrs);
};

const DeskReason = mongoose.model<DeskReasonAttrs, DeskReasonModel>("DeskReason", reasonSchema);

export { DeskReason };
