const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = {
      statusCode: 400,
      message,
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    err = {
      statusCode: 400,
      message,
    };
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, Try again `;
    err = {
      statusCode: 400,
      message,
    };
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is Expired, Try again `;
    err = {
      statusCode: 400,
      message,
    };
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    err = {
      statusCode: 400,
      message,
    };
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = errorHandler;
