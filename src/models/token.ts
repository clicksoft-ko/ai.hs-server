import mongoose from "mongoose";

export type TokenType = "changePw";
export interface TokenAttrs {
  userId: string;
  token: string;
  tokenType: TokenType;
  expiredAt: Date;
}

export interface TokenModel extends mongoose.Model<TokenDoc> {
  build(attrs: TokenAttrs): TokenDoc;
}

interface TokenDoc extends mongoose.Document, TokenAttrs { }

const tokenSchema = new mongoose.Schema<TokenAttrs, TokenModel>(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
    tokenType: { type: String, required: true },
    expiredAt: { type: Date, required: true, expires: 0 },
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

tokenSchema.statics.build = (attrs: TokenAttrs) => {
  return new Token(attrs);
};

const Token = mongoose.model<TokenAttrs, TokenModel>("Token", tokenSchema);

export { Token };
