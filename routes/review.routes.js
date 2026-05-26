import express from 'express';
import { createReview, getCarReviews, deleteReview } from '../controllers/review.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/:carId', getCarReviews);
router.delete('/:id', protect, adminOnly, deleteReview);

export default router;
