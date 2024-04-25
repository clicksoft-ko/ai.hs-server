"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionnareRouter = void 0;
const express_1 = require("express");
const questionnaire_1 = require("../joi/questionnaire");
const joy_error_1 = require("../errors/joy-error");
const router = (0, express_1.Router)();
exports.questionnareRouter = router;
router.get("/", (req, res) => {
    res.send({ a: "asdas" });
});
router.post("/", (req, res) => {
    const { error, value } = questionnaire_1.QuestionnaireSchema.validate(req.body);
    if (error) {
        throw new joy_error_1.JoyError(error);
    }
    else {
        console.log("val------------------------------");
        console.log(value);
        console.log("------------------------------");
    }
    res.send({ a: "asdas" });
});
//# sourceMappingURL=questionnare-router.js.map