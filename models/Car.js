import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number },
  pricePerDay: { type: Number, required: true },
  images: [{ type: String }],
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'], default: 'Petrol' },
  transmission: { type: String, enum: ['Auto', 'Manual'], default: 'Auto' },
  seats: { type: Number, default: 5 },
  description: { type: String },
  features: [{ type: String }],
  availability: { type: String, enum: ['Available', 'Unavailable', 'Booked'], default: 'Available' },
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  category: { type: String, enum: ['Luxury', 'Sports', 'SUV', 'Sedan', 'Electric', 'Convertible'], default: 'Luxury' },
  location: { type: String, default: 'New York, NY' },
  mileage: { type: String },
  color: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

carSchema.index({ brand: 1, pricePerDay: 1, availability: 1 });

export default mongoose.model('Car', carSchema);
