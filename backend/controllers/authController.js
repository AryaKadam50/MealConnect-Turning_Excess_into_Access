import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  const validRoles = ['user', 'ngo', 'restaurant', 'admin'];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be one of: user, ngo, restaurant, admin' });
  }
  
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }
  
  const user = await User.create({ name, email, password, role: role || 'user' });
  const token = generateToken(user._id);
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user._id);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});


