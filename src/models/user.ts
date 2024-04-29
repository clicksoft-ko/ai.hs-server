import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserAttrs {
  userId: string;
  password: string;
  roomKey: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document, UserAttrs {}

const userSchema = new mongoose.Schema<UserAttrs, UserModel>(
  {
    userId: { type: String, required: true },
    password: { type: String, required: true },
    roomKey: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

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

const User = mongoose.model<UserAttrs, UserModel>("User", userSchema);

export { User };
