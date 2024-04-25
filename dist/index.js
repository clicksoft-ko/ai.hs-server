"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionnare_router_1 = require("./routes/questionnare-router");
const error_handler_1 = require("./middlewares/error-handler");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/questionnare", questionnare_router_1.questionnareRouter);
app.use(error_handler_1.errorHandler);
app.get("/_healthcheck", (req, res) => {
    res.json({ uptime: process.uptime() });
});
app.get("/areWeDebugging", (req, res) => {
    res.json({ hellYeah: true });
});
app.listen(8000);
//# sourceMappingURL=index.js.map