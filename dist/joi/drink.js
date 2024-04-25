"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrinkSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const interfaces_1 = require("health-src-shared/interfaces");
const DrinkingFrequencySchema = joi_1.default.object({
    cup: joi_1.default.number().default(0),
    bottle: joi_1.default.number().default(0),
    can: joi_1.default.number().default(0),
    cc: joi_1.default.number().default(0),
});
const DrinkingKindSchema = joi_1.default.object({
    soju: DrinkingFrequencySchema,
    beer: DrinkingFrequencySchema,
    liquor: DrinkingFrequencySchema,
    makgeolli: DrinkingFrequencySchema,
    wine: DrinkingFrequencySchema,
});
const DrinkN7Schema = joi_1.default.object({
    type: joi_1.default.string()
        .valid(...Object.values(interfaces_1.EDrinkingFreqType))
        .required(),
    frequency: joi_1.default.number().when("type", {
        not: interfaces_1.EDrinkingFreqType.DO_NOT,
        then: joi_1.default.required(),
    }),
});
exports.DrinkSchema = joi_1.default.object({
    n7: DrinkN7Schema.required(),
    n7_1: DrinkingKindSchema.when("n7.type", {
        not: interfaces_1.EDrinkingFreqType.DO_NOT,
        then: joi_1.default.required(),
    }),
    n7_2: DrinkingKindSchema.when("n7.type", {
        not: interfaces_1.EDrinkingFreqType.DO_NOT,
        then: joi_1.default.required(),
    }),
});
//# sourceMappingURL=drink.js.map