import User from '../models/User.js';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [totalCars, totalUsers, totalBookings, payments] = await Promise.all([
      Car.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Payment.find({ status: 'paid' }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const recentBookings = await Booking.find().populate('user', 'name email').populate('car', 'name brand images').sort({ createdAt: -1 }).limit(10);

    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthPay = await Payment.find({ status: 'paid', createdAt: { $gte: start, $lte: end } });
      const revenue = monthPay.reduce((sum, p) => sum + p.amount, 0);
      monthlyRevenue.push({ month: start.toLocaleString('default', { month: 'short' }), revenue, bookings: monthPay.length });
    }

    const bookingStats = await Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);

    res.json({ success: true, stats: { totalCars, totalUsers, totalBookings, totalRevenue }, recentBookings, monthlyRevenue, bookingStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
