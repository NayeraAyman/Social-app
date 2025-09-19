"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = exports.BadRequestException = exports.NotAuthorizedException = exports.NotFoundException = exports.ConflictException = exports.AppError = void 0;
class AppError extends Error {
    stausCode;
    errorDetails;
    constructor(message, stausCode, errorDetails) {
        super(message);
        this.stausCode = stausCode;
        this.errorDetails = errorDetails;
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message, errorDetails) {
        super(message, 409, errorDetails);
    }
}
exports.ConflictException = ConflictException;
class NotFoundException extends AppError {
    constructor(message, errorDetails) {
        super(message, 404, errorDetails);
    }
}
exports.NotFoundException = NotFoundException;
class NotAuthorizedException extends AppError {
    constructor(message, errorDetails) {
        super(message, 401, errorDetails);
    }
}
exports.NotAuthorizedException = NotAuthorizedException;
class BadRequestException extends AppError {
    constructor(message, errorDetails) {
        super(message, 400, errorDetails);
    }
}
exports.BadRequestException = BadRequestException;
class TooManyRequestsException extends AppError {
    constructor(message, errorDetails) {
        super(message, 429, errorDetails);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
