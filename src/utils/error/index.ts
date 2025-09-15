export class AppError extends Error {
  constructor(
    message: string,
    public stausCode: number,
    public errorDetails?: Record<string, any>[]
  ) {
    super(message);
  }
}

export class ConflictException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 409, errorDetails);
  }
}
export class NotFoundException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 404, errorDetails);
  }
}

export class NotAuthorizedException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 401, errorDetails);
  }
}
export class BadRequestException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 400, errorDetails);
  }
}
export class TooManyRequestsException extends AppError {
  constructor(message: string, errorDetails?: Record<string, any>[]) {
    super(message, 429, errorDetails);
  }
}
