"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
const utils_1 = require("../utils");
const isValid = (schema) => {
    return (req, res, next) => {
        //validate data
        let data = { ...req.body, ...req.params, ...req.query };
        const validateData = schema.safeParse(data);
        if (validateData.success == false) {
            let errMessages = validateData.error.issues.map((issue) => ({
                path: issue.path[0],
                message: issue.message,
            }));
            throw new utils_1.BadRequestException("validation error", errMessages);
        }
        next();
    };
};
exports.isValid = isValid;
