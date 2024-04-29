import express from "express";
import "express-async-errors";
import { questionnareRouter } from "./routes/questionnaire/questionnare-router";
import { errorHandler } from "./middlewares/error-handler";
import cors from "cors";
import cookieSession from "cookie-session";
import { signupRouter } from "./routes/signup/signup";
import { currentUserRouter } from "./routes/current-user.ts/current-user";
import { signoutRouter } from "./routes/signout/signout";
import { signinRouter } from "./routes/signin/signin";
import cookieParser from "cookie-parser";

const app = express();
app.set("trust proxy", true);

app.use(
  cors({
    origin: ["http://localhost:3020", "https://localhost:3020"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === "production",
  })
);

app.use("/api/questionnare", questionnareRouter);
app.use("/api/signin", signinRouter);
app.use("/api/signup", signupRouter);
app.use("/api/signout", signoutRouter);
app.use("/api/currentuser", currentUserRouter);

app.use(errorHandler);

export { app };
