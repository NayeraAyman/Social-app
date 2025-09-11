"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsException = exports.BadRequestException = exports.NotAuthorizedException = exports.NotFoundException = exports.ConflictException = exports.AppError = void 0;
class AppError extends Error {
    stausCode;
    constructor(message, stausCode) {
        super(message);
        this.stausCode = stausCode;
    }
}
exports.AppError = AppError;
class ConflictException extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictException = ConflictException;
class NotFoundException extends AppError {
    constructor(message) {
        super(message, 404);
    }
}
exports.NotFoundException = NotFoundException;
class NotAuthorizedException extends AppError {
    constructor(message) {
        super(message, 401);
    }
}
exports.NotAuthorizedException = NotAuthorizedException;
class BadRequestException extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.BadRequestException = BadRequestException;
class TooManyRequestsException extends AppError {
    constructor(message) {
        super(message, 429);
    }
}
exports.TooManyRequestsException = TooManyRequestsException;
