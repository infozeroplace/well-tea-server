import httpStatus from 'http-status';
import { ZodError } from 'zod';
import config from '../config/index.js';
import ApiError from '../error/ApiError.js';
import handleCastError from '../error/handleCastError.js';
import handleMongoServerError from '../error/handleMongoServerError.js';
import handleStripeError from '../error/handleStripeError.js';
import handleValidationError from '../error/handleValidationError.js';
import handleZodError from '../error/handleZodError.js';
import { errorLogger } from '../shared/logger.js';

const globalErrorHandler = (
  error, // <= All the error comes through  this error
  req, // Express request object
  res, // Express response object
  next, // Express next function
) => {
  /**
   While "development" mode here it will print the error. And while "production" mode it will store the error log and also it'll print the error because in the "errorLogger" function instructions are given to print on console. 
   */
  config.env === 'development'
    ? `❌👮‍♀️ globalErrorHandler ~`
    : errorLogger.error(`❌❌ globalErrorHandler ~`, error);
  // ..................

  /**
  A generic error response must holds initial status code, error message and error messages by default. 
  This portions will be changed based on the error type dynamically
  */
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong!';
  let errorMessages = [];
  let simplifiedError;

  // When mongoose schema validation error caught
  switch (true) {
    case error?.name === 'MongoServerError':
      simplifiedError = handleMongoServerError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
      errorMessages = simplifiedError?.errorMessages;
      // ...
      break;

    case error?.name === 'ValidationError':
      simplifiedError = handleValidationError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
      errorMessages = simplifiedError?.errorMessages;
      // ...
      break;

    case error?.name === 'CastError':
      simplifiedError = handleCastError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
      errorMessages = simplifiedError?.errorMessages;
      // ...
      break;

    case error instanceof ZodError:
      simplifiedError = handleZodError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
      errorMessages = simplifiedError?.errorMessages;
      // ...
      break;

    case error?.type && error.type.startsWith('Stripe'):
      simplifiedError = handleStripeError(error);
      statusCode = simplifiedError?.statusCode;
      message = simplifiedError?.message;
      errorMessages = simplifiedError?.errorMessages;
      // ...
      break;

    case error instanceof ApiError:
      statusCode = error?.statusCode;
      message = error?.message;
      errorMessages = error?.message
        ? [
            {
              path: '',
              message: error?.message,
            },
          ]
        : [];
      // ...
      break;

    case error instanceof Error:
      message = error?.message;
      errorMessages = error?.message
        ? [
            {
              path: '',
              message: error?.message,
            },
          ]
        : [];
      // ...
      break;
  }

  // Generic Error Response
  next();
  return res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config?.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;
