import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  pickupLocation: { type: String, required: true },
  returnLocation: { type: String },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  pricePerDay: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  couponCode: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'], default: 'Pending' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid', 'Refunded'], default: 'Unpaid' },
  paymentMethod: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  notes: { type: String },
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'RR' + Date.now().toString().slice(-8);
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
