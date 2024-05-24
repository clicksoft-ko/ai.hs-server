import express from "express";
import "express-async-errors";
import { questionnareRouter as questionnaireRouter } from "./routes/questionnaire/questionnare-router";
import { errorHandler } from "./middlewares/error-handler";
import cors from "cors";
import cookieSession from "cookie-session";
import { signupRouter } from "./routes/signup/signup";
import { currentUserRouter } from "./routes/current-user/current-user";
import { signoutRouter } from "./routes/signout/signout";
import { signinRouter } from "./routes/signin/signin";
import cookieParser from "cookie-parser";
import swaggerUi from 'swagger-ui-express'
import swaggerFile from './swagger/swagger-release.json'
import { checkPwRouter } from "./routes/check-pw/check-pw";
import { settingsRouter } from "./routes/settings/settings";
import { adminSettingsRouter } from "./routes/admin-settings/save-admin-settings";

// const swaggerFile = require("../swagger/swagger-output");

const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: [
      "http://localhost:3020",
      "https://localhost:3020",
      "https://hs.click-soft.co.kr",
    ],
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

app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/api/questionnaire", questionnaireRouter);
app.use("/api/signin", signinRouter);
app.use("/api/signup", signupRouter);
app.use("/api/signout", signoutRouter);
app.use("/api/checkpw", checkPwRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/admin-settings", adminSettingsRouter);
app.use("/api/currentuser", currentUserRouter);

app.use(errorHandler);

export { app };
