import mongoose from "mongoose";

export interface QuestionnaireSettings {
  use?: boolean;
  lockPw?: string;
}

export const questionnaireSchema = new mongoose.Schema<QuestionnaireSettings>(
  {
    use: { type: Boolean },
    lockPw: { type: String },
  },
  { _id: false }
)