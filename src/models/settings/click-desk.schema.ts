import mongoose from "mongoose";

export interface ClickDeskSettings {
  use?: boolean;
}

export const clickDeskSchema = new mongoose.Schema<ClickDeskSettings>(
  {
    use: { type: Boolean },
  },
  { _id: false }
)