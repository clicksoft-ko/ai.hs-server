"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivitySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ActiveTermSchema = joi_1.default.object({
    hours: joi_1.default.number().min(1).max(23).required(),
    minutes: joi_1.default.number().min(0).max(59).default(0).required(),
});
exports.ActivitySchema = joi_1.default.object({
    n8_1: joi_1.default.number().min(1).max(7).required(),
    n8_2: ActiveTermSchema.required(),
    n9_1: joi_1.default.number().min(1).max(7).required(),
    n9_2: ActiveTermSchema.required(),
    n10: joi_1.default.number().required(),
});
//# sourceMappingURL=activity.js.map