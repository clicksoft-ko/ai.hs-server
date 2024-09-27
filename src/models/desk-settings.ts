import mongoose from "mongoose";

interface Feature {
  unUseQR: boolean;
}

export interface DeskSettingsAttrs {
  userId: string;
  feature: Feature;
}

export interface DeskSettingsModel extends mongoose.Model<DeskSettingsDoc> {
  build(attrs: DeskSettingsAttrs): DeskSettingsDoc;
}

export interface DeskSettingsDoc extends mongoose.Document, DeskSettingsAttrs { }

const featureSchema = new mongoose.Schema(
  {
    unUseQR: { type: Boolean, required: true, default: false }
  },
  { _id: false }
);

const deskSettingsSchema = new mongoose.Schema<DeskSettingsAttrs, DeskSettingsModel>(
  {
    userId: { type: String, required: true },
    feature: { type: featureSchema, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

deskSettingsSchema.statics.build = (attrs: DeskSettingsAttrs) => {
  return new DeskSettings(attrs);
};

const DeskSettings = mongoose.model<DeskSettingsAttrs, DeskSettingsModel>("DeskSettings", deskSettingsSchema);

export { DeskSettings };

