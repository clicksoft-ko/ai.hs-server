import mongoose from "mongoose";

export interface SettingsAttrs {
  lockPw: string;
}

export interface SettingsModel extends mongoose.Model<SettingsDoc> {
  build(attrs: SettingsAttrs): SettingsDoc;
}

export interface SettingsDoc extends mongoose.Document, SettingsAttrs { }

const userSchema = new mongoose.Schema<SettingsAttrs, SettingsModel>(
  {
    lockPw: { type: String, required: true },
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

userSchema.statics.build = (attrs: SettingsAttrs) => {
  return new Settings(attrs);
};

const Settings = mongoose.model<SettingsAttrs, SettingsModel>("Settings", userSchema);

export { Settings };
