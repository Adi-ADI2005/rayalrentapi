import express from 'express';
import { updateProfile, toggleWishlist, getWishlist, markNotificationsRead } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:carId', protect, toggleWishlist);
router.patch('/notifications/read', protect, markNotificationsRead);

export default router;
