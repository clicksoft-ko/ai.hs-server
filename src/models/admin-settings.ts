import { db } from "@/database/db";
import mongoose from "mongoose";

export interface AdminSettingsAttrs {
  managerCode?: string;
}

export interface AdminSettingsModel extends mongoose.Model<AdminSettingsDoc> {
  build(attrs: AdminSettingsAttrs): AdminSettingsDoc;
}

export interface AdminSettingsDoc extends mongoose.Document, AdminSettingsAttrs { }

const userSchema = new mongoose.Schema<AdminSettingsAttrs, AdminSettingsModel>(
  {
    managerCode: { type: String, required: false },
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

userSchema.statics.build = (attrs: AdminSettingsAttrs) => {
  return new AdminSettings(attrs);
};

const AdminSettings = db.model<AdminSettingsAttrs, AdminSettingsModel>("AdminSettings", userSchema);

export { AdminSettings };
