import express from 'express';
import { createOrder, verifyPayment, getUserPayments, getAllPayments, demoPayment } from '../controllers/payment.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/demo-pay', protect, demoPayment);
router.get('/my', protect, getUserPayments);
router.get('/all', protect, adminOnly, getAllPayments);

export default router;
