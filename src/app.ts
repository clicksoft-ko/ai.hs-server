import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import cors from "cors";
import express from "express";
import "express-async-errors";
import path from "path";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { isProduction } from "./constants/env-const";
import { errorHandler } from "./middlewares/error-handler";
import { httpLogMiddleware } from "./middlewares/http-log-middleware";
import { metrics } from "./middlewares/metrics/prometheus-metrics";
import { adFileRouter } from "./routes/ad-file/ad-file";
import { adminSettingsRouter } from "./routes/admin-settings";
import { clickdeskDoctorRouter } from "./routes/clickdesk/doctor/desk-doctor";
import { clickdeskReasonRouter } from "./routes/clickdesk/reason/desk-reason";
import { clickdeskSettingsRouter } from "./routes/clickdesk/settings/desk-settings";
import { currentUserRouter } from "./routes/current-user/current-user";
import { imagesRouter } from "./routes/images/images";
import { settingsRouter } from "./routes/settings/settings";
import { signinRouter } from "./routes/signin/signin";
import { signoutRouter } from "./routes/signout/signout";
import { signupRouter } from "./routes/signup";
import { tokenRouter } from "./routes/token/token";
import { usersRouter } from "./routes/users";
import { webAppUsersRouter } from "./routes/web-app-users";
import { webAppSettingsRouter } from "./routes/web-app/settings";
import { commonSettingsRouter } from "./routes/common-settings/common-settings";

const app = express();

app.set("trust proxy", true);

app.use(
  cors({
    origin: [
      "http://localhost:3020",
      "https://localhost:3020",
      "http://hs-local.click-soft.co.kr",
      "https://hs-local.click-soft.co.kr",
      "http://hs.click-soft.co.kr",
      "https://hs.click-soft.co.kr",
    ],
    credentials: true,
  })
);

app.use(httpLogMiddleware);
app.use('/api', express.static(path.join(__dirname, "_public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    signed: false,
    secure: isProduction,
  })
);

app.get('/api/metrics', metrics.getMetricsEndpoint);
if (process.env.NODE_ENV !== 'test') {
  const swaggerSpec = YAML.load(path.join(__dirname, './swagger/swagger.yaml'))
  app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use("/api/images", imagesRouter);
app.use("/api/ad-file", adFileRouter);
app.use("/api/signin", signinRouter);
app.use("/api/signup", signupRouter);
app.use("/api/signout", signoutRouter);
app.use("/api/users", usersRouter);
app.use("/api/common-settings", commonSettingsRouter);
app.use("/api/web-app/settings", webAppSettingsRouter);
app.use("/api/web-app-users", webAppUsersRouter); // GRPC
app.use("/api/token", tokenRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/admin-settings", adminSettingsRouter);
app.use("/api/currentuser", currentUserRouter);
app.use("/api/clickdesk/doctor", clickdeskDoctorRouter);
app.use("/api/clickdesk/reason", clickdeskReasonRouter);
app.use("/api/clickdesk/settings", clickdeskSettingsRouter);
app.use(errorHandler);

export { app };

