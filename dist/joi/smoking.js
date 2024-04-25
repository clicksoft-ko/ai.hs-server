"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmokingSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const ISmokingN6d1 = {
    no: 0,
    everyDay: 1,
    month_1_2: 2,
    month_3_9: 3,
    month_10_29: 4,
};
const SmokingTermSchema = joi_1.default.object({
    totalYears: joi_1.default.number().min(1).max(99).default(0).required(),
    cigarettes: joi_1.default.number().min(1).max(999).default(0).required(),
    quitYears: joi_1.default.number().min(1).max(99),
});
const SmokingResultSchema = joi_1.default.object({
    smoking: joi_1.default.boolean().required(),
    term: SmokingTermSchema.required().when("smoking", {
        is: true,
        then: SmokingTermSchema.required(),
        otherwise: SmokingTermSchema.required().keys({
            quitYears: joi_1.default.required(),
        }),
    }),
});
exports.SmokingSchema = joi_1.default.object({
    n4: joi_1.default.boolean().required(),
    n4_1: SmokingResultSchema.when("n4", {
        is: true,
        then: SmokingResultSchema.required(),
    }),
    n5: joi_1.default.boolean().required(),
    n5_1: SmokingResultSchema.when("n5", {
        is: true,
        then: SmokingResultSchema.required(),
    }),
    n6: joi_1.default.boolean().required(),
    n6_1: joi_1.default.number()
        .valid(...Object.values(ISmokingN6d1))
        .when("n6", {
        is: true,
        then: joi_1.default.required(),
    }),
});
//# sourceMappingURL=smoking.js.map