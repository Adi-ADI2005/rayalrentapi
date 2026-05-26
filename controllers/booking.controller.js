import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

export const createBooking = async (req, res) => {
  try {
    const { carId, pickupLocation, returnLocation, pickupDate, returnDate, couponCode } = req.body;
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    if (car.availability !== 'Available') return res.status(400).json({ success: false, message: 'Car not available' });

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const totalDays = Math.max(1, Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24)));
    const subtotal = totalDays * car.pricePerDay;
    const tax = Math.round(subtotal * 0.18);
    let discount = 0;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true, expiryDate: { $gte: new Date() } });
      if (coupon && subtotal >= coupon.minBookingAmount) {
        discount = coupon.discountType === 'percentage' ? Math.min(subtotal * coupon.discountValue / 100, coupon.maxDiscount || Infinity) : coupon.discountValue;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const totalAmount = subtotal + tax - discount;
    const booking = await Booking.create({
      user: req.user._id, car: carId, pickupLocation, returnLocation: returnLocation || pickupLocation,
      pickupDate: pickup, returnDate: returnD, totalDays, pricePerDay: car.pricePerDay,
      subtotal, tax, discount, totalAmount, couponCode,
    });

    res.status(201).json({ success: true, message: 'Booking created', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('car', 'name brand images pricePerDay').sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('car').populate('user', 'name email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    if (['Completed', 'Cancelled'].includes(booking.status)) return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    booking.status = 'Cancelled';
    await booking.save();
    await Car.findByIdAndUpdate(booking.car, { availability: 'Available' });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter).populate('user', 'name email').populate('car', 'name brand images').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, bookings, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (status === 'Confirmed') await Car.findByIdAndUpdate(booking.car, { availability: 'Booked' });
    if (['Completed', 'Cancelled'].includes(status)) await Car.findByIdAndUpdate(booking.car, { availability: 'Available' });
    res.json({ success: true, message: 'Status updated', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
