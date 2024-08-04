import mongoose from "mongoose";

export interface WebAppSettings {
  use?: boolean;
}

export const webAppSchema = new mongoose.Schema<WebAppSettings>(
  {
    use: { type: Boolean },
  },
  { _id: false }
)