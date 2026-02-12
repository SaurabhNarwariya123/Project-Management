const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const CustomError = require('../utils/errorHandler');

// Register user
const register = async (req, res, next) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return next(new CustomError('User already exists', 400));
    }

    // Create user
    user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role: role || 'TeamMember',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return next(new CustomError('Please provide email/username and password', 400));
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user) {
      return next(new CustomError('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new CustomError('Invalid credentials', 401));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, department, profileImage } = req.body;

    let user = await User.findById(req.user.id);

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;
    if (department) user.department = department;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('projects');

    if (!user) {
      return next(new CustomError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateProfile,
  getAllUsers,
  getUserById,
};
