import User from '../models/User.js';
import { sendTokens, generateAccessToken } from '../utils/jwt.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const { accessToken } = sendTokens(res, user);
    res.status(201).json({ success: true, message: 'Registered successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.isBlocked) return res.status(403).json({ success: false, message: 'Account blocked' });
    const { accessToken } = sendTokens(res, user);
    res.json({ success: true, message: 'Login successful', user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    if (!email || !googleId) return res.status(400).json({ success: false, message: 'Invalid google data' });
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar, isGoogleAuth: true, isEmailVerified: true });
    } else {
      if (!user.googleId) { user.googleId = googleId; user.isGoogleAuth = true; await user.save(); }
    }
    if (user.isBlocked) return res.status(403).json({ success: false, message: 'Account blocked' });
    const { accessToken } = sendTokens(res, user);
    res.json({ success: true, message: 'Google login successful', user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }, accessToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name brand images pricePerDay');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    const accessToken = generateAccessToken(user._id, user.role);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, accessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};
