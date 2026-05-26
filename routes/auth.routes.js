import express from 'express';
import { register, login, googleAuth, logout, getMe, refreshToken } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

export default router;
