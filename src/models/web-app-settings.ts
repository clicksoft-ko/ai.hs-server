import mongoose from "mongoose";

interface Reading {
  commonDays: number;
  gumsaDays: number;
}

export interface WebAppSettingsAttrs {
  hsId: mongoose.Schema.Types.ObjectId;
  reading: Reading;
}

export interface WebAppSettingsModel extends mongoose.Model<WebAppSettingsDoc> {
  build(attrs: WebAppSettingsAttrs): WebAppSettingsDoc;
}

export interface WebAppSettingsDoc extends mongoose.Document, WebAppSettingsAttrs { }

const readingSchema = new mongoose.Schema(
  {
    commonDays: { type: Number, required: true, default: 90 },
    gumsaDays: { type: Number, required: true, default: 90 },
  },
  { _id: false }
);

const webAppSettingsSchema = new mongoose.Schema<WebAppSettingsAttrs, WebAppSettingsModel>(
  {
    hsId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    reading: { type: readingSchema, required: true },
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

webAppSettingsSchema.statics.build = (attrs: WebAppSettingsAttrs) => {
  return new WebAppSettings(attrs);
};

const WebAppSettings = mongoose.model<WebAppSettingsAttrs, WebAppSettingsModel>("WebAppSettings", webAppSettingsSchema);

export { WebAppSettings };

