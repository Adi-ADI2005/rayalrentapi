import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const updateData = { name, phone, address };
    if (req.file) updateData.avatar = req.file.path;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    res.json({ success: true, message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const carId = req.params.carId;
    const idx = user.wishlist.indexOf(carId);
    if (idx > -1) user.wishlist.splice(idx, 1);
    else user.wishlist.push(carId);
    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name brand images pricePerDay rating availability');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { 'notifications.$[].read': true } });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
