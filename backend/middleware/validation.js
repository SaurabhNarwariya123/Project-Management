const { validationResult } = require('express-validator');
const CustomError = require('../utils/errorHandler');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new CustomError(errorMessages.join(', '), 400));
  }
  next();
};

module.exports = {
  validate,
};
