import express from 'express';
import { validateCoupon, createCoupon, getCoupons, deleteCoupon } from '../controllers/coupon.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;
