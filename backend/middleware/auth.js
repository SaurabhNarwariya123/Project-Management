const CustomError = require('../utils/errorHandler');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new CustomError('Not authorized to access this route', 401));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new CustomError('Not authorized to access this route', 401));
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    if (!user.isActive) {
      return next(new CustomError('User account is inactive', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new CustomError('Not authorized to access this route', 401));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
