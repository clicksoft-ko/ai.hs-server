import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { SettingsDoc } from "./settings/settings";
import { db } from "@/database/db";

export interface UserAttrs {
  userId: string;
  password: string;
  email: string;
  orgName: string;
  roomKey: string;
  admin?: boolean;
  location?: {
    type: "Point";
    coordinates: number[];
  };
  settings?: SettingsDoc;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

export interface UserDoc extends mongoose.Document, UserAttrs {
  createdAt?: Date;
  updatedAt?: Date;
}

const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema<UserAttrs, UserModel>(
  {
    userId: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    orgName: { type: String, required: true },
    roomKey: { type: String, required: true },
    admin: { type: Boolean, required: false },
    settings: { type: mongoose.Schema.Types.ObjectId, ref: "Settings" },
    location: { type: locationSchema, required: false },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ``
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

// 지리공간 인덱스 생성
userSchema.index({ location: '2dsphere' });

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await bcrypt.hash(this.get("password"), 9);
    this.set("password", hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = db.model<UserAttrs, UserModel>("User", userSchema);

export { User };
