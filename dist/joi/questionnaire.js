"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const history_1 = require("./history");
const smoking_1 = require("./smoking");
const drink_1 = require("./drink");
const activity_1 = require("./activity");
exports.QuestionnaireSchema = joi_1.default.object({
    history: history_1.HistorySchema.required(),
    smoking: smoking_1.SmokingSchema.required(),
    drink: drink_1.DrinkSchema.required(),
    activity: activity_1.ActivitySchema.required(),
});
//# sourceMappingURL=questionnaire.js.map