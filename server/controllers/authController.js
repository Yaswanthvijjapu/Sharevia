import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(StatusCodes.CREATED).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// Login a user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(StatusCodes.OK).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};

// Get current user profile
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server error' });
  }
};