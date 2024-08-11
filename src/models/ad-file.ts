import mongoose from "mongoose";

export type AdFileType = "image" | 'video';
export interface AdFileAttrs {
  userId: string;
  fileName: string;
  fileType: AdFileType;
  seq: number;

}

export interface AdFileModel extends mongoose.Model<AdFileDoc> {
  build(attrs: AdFileAttrs): AdFileDoc;
}

interface AdFileDoc extends mongoose.Document, AdFileAttrs { }

const adFileSchema = new mongoose.Schema<AdFileAttrs, AdFileModel>(
  {
    userId: { type: String, default: "" },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    seq: { type: Number, required: true },
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

adFileSchema.statics.build = (attrs: AdFileAttrs) => {
  return new AdFile(attrs);
};

const AdFile = mongoose.model<AdFileAttrs, AdFileModel>("AdFile", adFileSchema);

export { AdFile };
