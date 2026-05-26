import express from 'express';
import { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings, updateBookingStatus } from '../controllers/booking.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getUserBookings);
router.get('/all', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
