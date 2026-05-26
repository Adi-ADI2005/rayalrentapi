import Coupon from '../models/Coupon.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true, expiryDate: { $gte: new Date() } });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid or expired coupon' });
    if (amount < coupon.minBookingAmount) return res.status(400).json({ success: false, message: `Minimum booking amount: ₹${coupon.minBookingAmount}` });

    const discount = coupon.discountType === 'percentage'
      ? Math.min(amount * coupon.discountValue / 100, coupon.maxDiscount || Infinity)
      : coupon.discountValue;

    res.json({ success: true, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: Math.round(discount) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
