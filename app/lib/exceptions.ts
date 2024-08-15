import * as yup from 'yup';
import { INVALID_TOKEN, UNAUTHORIZED_ACCESS } from './constants/errors';
import { ResultCode } from './utils';

export class FetchException extends Error {
  constructor(
    message = 'Server Error: There is an issue retrieving the data.'
  ) {
    super(message);
    this.name = 'FetchException';
  }
}

export class ResponseError extends Error {
  response: Response;

  constructor(message: string, res: Response) {
    super(message);
    this.response = res;
  }
}

export class ApiError extends Error {
  constructor(
    public error_id: string,
    public title: string,
    public message: string,
    public errors: {
      error_id: string;
      title: string;
      message: string;
      field?: string;
    }[] = []
  ) {
    super(message);
  }

  static fromYupError(
    yupError: yup.ValidationError,
    error_id: string
  ): ApiError {
    const errors = yupError.inner.map((err) => ({
      error_id: error_id,
      title: 'Validation error',
      message: err.errors[0],
      field: err.path
    }));

    return new ApiError(
      'CUS-0004',
      'Validation error',
      'One or more field input values are invalid. Please check again.',
      errors
    );
  }

  static fromBadRequest() {
    return new ApiError(
      'CUS-0001',
      ResultCode.BadRequest,
      'The request could not be processed due to invalid input.'
    );
  }

  static fromNotfound() {
    return new ApiError(
      'CUS-0002',
      ResultCode.NotFound,
      'The requested resource could not be found.'
    );
  }

  static fromInvalidEmailPassword() {
    return new ApiError(
      'LO-0001',
      ResultCode.InvalidCredentials,
      'Invalid username or password.'
    );
  }

  static fromUnauthorized() {
    return new ApiError(
      UNAUTHORIZED_ACCESS,
      ResultCode.UnauthorizedAccess,
      'Unauthorized access.'
    );
  }

  static fromUnverified() {
    return new ApiError(
      'LO-0003',
      ResultCode.UnverifiedUser,
      'Unverified user. Please check your email.'
    );
  }

  static fromInvalidToken() {
    return new ApiError(INVALID_TOKEN, 'Auth error', 'Invalid token.');
  }

  static fromInvalidRegisterToken() {
    return new ApiError('RE-0003', 'Unauthorized', 'Invalid token.');
  }

  static fromEmailExists() {
    return new ApiError(
      'RE-0001',
      'Register error',
      'One or more field input values are invalid. Please check again.',
      [
        {
          error_id: 'RE-0001',
          title: 'Register error',
          message: 'Email already exists.',
          field: 'email'
        }
      ]
    );
  }

  static fromUnexpected(): ApiError {
    return new ApiError(
      'CUS-0500',
      ResultCode.UnknownError,
      'An unexpected error occurred. Please try again later.'
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      error: {
        error_id: this.error_id,
        title: this.title,
        message: this.message,
        errors: this.errors
      }
    };
  }
}

export function handleError(error: ApiError, status: number) {
  return Response.json(error.toJSON(), {
    status
  });
}
