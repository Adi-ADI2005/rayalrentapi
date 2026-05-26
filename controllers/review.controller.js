import Review from '../models/Review.js';
import Car from '../models/Car.js';

export const createReview = async (req, res) => {
  try {
    const { carId, rating, comment, bookingId } = req.body;
    const exists = await Review.findOne({ car: carId, user: req.user._id });
    if (exists) return res.status(400).json({ success: false, message: 'Already reviewed' });

    const review = await Review.create({ user: req.user._id, car: carId, booking: bookingId, rating, comment });
    await review.populate('user', 'name avatar');

    const reviews = await Review.find({ car: carId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Car.findByIdAndUpdate(carId, { rating: avgRating.toFixed(1), totalReviews: reviews.length });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCarReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ car: req.params.carId }).populate('user', 'name avatar').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
