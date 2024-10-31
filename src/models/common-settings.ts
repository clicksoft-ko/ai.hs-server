import mongoose from "mongoose";
import { AdMessage } from "./types/ad-message";

export interface CommonSettingsAttrs {
  adMessage?: AdMessage;
}

export interface CommonSettingsModel extends mongoose.Model<CommonSettingsDoc> {
  build(attrs: CommonSettingsAttrs): CommonSettingsDoc;
}

interface CommonSettingsDoc extends mongoose.Document, CommonSettingsAttrs { }

const commonSettingsSchema = new mongoose.Schema<CommonSettingsAttrs, CommonSettingsModel>(
  {
    adMessage: {
      message: { type: String, required: false },
      animationSeconds: { type: Number, required: false },
      _id: false
    },
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

commonSettingsSchema.statics.build = (attrs: CommonSettingsAttrs) => {
  return new CommonSettings(attrs);
};

const CommonSettings = mongoose.model<CommonSettingsAttrs, CommonSettingsModel>("CommonSettings", commonSettingsSchema);

export { CommonSettings };

