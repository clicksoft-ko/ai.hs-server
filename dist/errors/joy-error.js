"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoyError = void 0;
const custom_error_1 = require("./custom-error");
class JoyError extends custom_error_1.CustomError {
    error;
    statusCode = 400;
    constructor(error) {
        super(error.message);
        this.error = error;
    }
    serializeErrors() {
        console.error(this.error.annotate());
        return this.error.details.map((d) => ({
            message: d.message,
            path: d.path,
            pathKey: d.context?.label,
        }));
    }
}
exports.JoyError = JoyError;
//# sourceMappingURL=joy-error.js.map