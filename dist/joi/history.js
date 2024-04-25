"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorySchema = void 0;
const joi_1 = __importDefault(require("joi"));
const EHistoryN3 = {
    yes: 1,
    no: 2,
    doNotKnown: 3,
};
const HistoryN1ResultSchema = joi_1.default.object({
    diagnosis: joi_1.default.boolean().default(false).description("진단"),
    drugTherapy: joi_1.default.boolean().default(false).description("약물치료"),
}).default({ diagnosis: false, drugTherapy: false });
const HistoryN1Schema = joi_1.default.object({
    stroke: HistoryN1ResultSchema,
    angina: HistoryN1ResultSchema,
    hypertension: HistoryN1ResultSchema,
    diabetes: HistoryN1ResultSchema,
    dyslipidemia: HistoryN1ResultSchema,
    PT: HistoryN1ResultSchema,
    others: HistoryN1ResultSchema,
});
const HistoryN2Schema = joi_1.default.object({
    stroke: joi_1.default.boolean().default(false).description("뇌졸증"),
    angina: joi_1.default.boolean().default(false).description("협심증"),
    hypertension: joi_1.default.boolean().default(false).description("고혈압"),
    diabetes: joi_1.default.boolean().default(false).description("당뇨병"),
    others: joi_1.default.boolean().default(false).description("기타"),
});
exports.HistorySchema = joi_1.default.object({
    n1: HistoryN1Schema,
    n2: HistoryN2Schema,
    n3: joi_1.default.valid(...Object.values(EHistoryN3)).required(),
});
module.exports = { HistorySchema: exports.HistorySchema };
//# sourceMappingURL=history.js.map