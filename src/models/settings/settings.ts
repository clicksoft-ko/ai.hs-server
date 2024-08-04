import mongoose from "mongoose";
import { ClickDeskSettings, clickDeskSchema } from "./click-desk.schema";
import { QuestionnaireSettings, questionnaireSchema } from "./questionnaire.schema";
import { WebAppSettings, webAppSchema } from "./web-app.schema";

export interface SettingsAttrs {
  clickDesk?: ClickDeskSettings;
  webApp?: WebAppSettings;
  questionnaire?: QuestionnaireSettings;
}

export interface SettingsModel extends mongoose.Model<SettingsDoc> {
  build(attrs: SettingsAttrs): SettingsDoc;
}

export interface SettingsDoc extends mongoose.Document, SettingsAttrs { }

const userSchema = new mongoose.Schema<SettingsAttrs, SettingsModel>(
  {
    clickDesk: { type: clickDeskSchema, required: false },
    webApp: { type: webAppSchema, required: false },
    questionnaire: { type: questionnaireSchema, required: false },
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
