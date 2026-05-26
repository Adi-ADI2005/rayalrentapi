import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.paymentStatus === 'Paid') return res.status(400).json({ success: false, message: 'Already paid' });

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: { bookingId: bookingId.toString(), userId: req.user._id.toString() },
    });

    booking.razorpayOrderId = order.id;
    await booking.save();

    await Payment.create({
      user: req.user._id,
      booking: bookingId,
      razorpayOrderId: order.id,
      amount: booking.totalAmount,
      currency: 'INR',
    });

    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign).digest('hex');

    if (expectedSign !== razorpay_signature) return res.status(400).json({ success: false, message: 'Payment verification failed' });

    const booking = await Booking.findById(bookingId).populate('car');
    booking.paymentStatus = 'Paid';
    booking.status = 'Confirmed';
    booking.razorpayPaymentId = razorpay_payment_id;
    booking.paymentMethod = 'razorpay';
    await booking.save();

    await Car.findByIdAndUpdate(booking.car._id, { availability: 'Booked' });

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature, status: 'paid' }
    );

    res.json({ success: true, message: 'Payment verified successfully', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const demoPayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId).populate('car');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.paymentStatus === 'Paid') return res.status(400).json({ success: false, message: 'Already paid' });

    const demoTxnId = `DEMO_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    booking.paymentStatus = 'Paid';
    booking.status = 'Confirmed';
    booking.razorpayPaymentId = demoTxnId;
    booking.razorpayOrderId = booking.razorpayOrderId || `DEMO_ORDER_${Date.now()}`;
    booking.paymentMethod = method || 'demo';
    await booking.save();

    if (booking.car) {
      await Car.findByIdAndUpdate(booking.car._id, { availability: 'Booked' });
    }

    await Payment.create({
      user: req.user._id,
      booking: bookingId,
      razorpayOrderId: booking.razorpayOrderId,
      razorpayPaymentId: demoTxnId,
      amount: booking.totalAmount,
      currency: 'INR',
      status: 'paid',
      method: method || 'demo',
    });

    res.json({ success: true, message: 'Demo payment successful', booking, txnId: demoTxnId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({ path: 'booking', populate: { path: 'car', select: 'name brand images' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate({ path: 'booking', populate: { path: 'car', select: 'name brand' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
