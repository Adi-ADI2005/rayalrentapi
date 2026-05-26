import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/Car.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const sampleCars = [
  { name: 'Lamborghini Huracán', brand: 'Lamborghini', model: 'Huracán EVO', year: 2024, pricePerDay: 49900, fuelType: 'Petrol', transmission: 'Auto', seats: 2, category: 'Sports', rating: 4.9, totalReviews: 32, availability: 'Available', location: 'Mumbai, Maharashtra', features: ['V10 Engine', 'Carbon Fiber Body', 'Launch Control', 'GPS', 'Bluetooth', 'Rear Camera'], description: 'Experience the thrill of the Lamborghini Huracán EVO with its naturally aspirated V10 engine delivering 631 hp.', images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80'] },
  { name: 'Ferrari 488 GTB', brand: 'Ferrari', model: '488 GTB', year: 2023, pricePerDay: 59900, fuelType: 'Petrol', transmission: 'Auto', seats: 2, category: 'Sports', rating: 4.9, totalReviews: 28, availability: 'Available', location: 'Delhi, NCR', features: ['Twin-Turbo V8', 'Carbon Ceramic Brakes', 'Launch Control', 'GPS', 'Premium Sound'], description: 'The Ferrari 488 GTB is the pinnacle of Italian engineering with a twin-turbocharged V8.', images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'] },
  { name: 'Porsche 911 Carrera', brand: 'Porsche', model: '911 Carrera S', year: 2024, pricePerDay: 39900, fuelType: 'Petrol', transmission: 'Auto', seats: 4, category: 'Sports', rating: 4.8, totalReviews: 45, availability: 'Available', location: 'Bangalore, Karnataka', features: ['Flat-6 Engine', 'PASM Suspension', 'Sport Chrono', 'Bose Sound', 'GPS'], description: 'The iconic Porsche 911 Carrera S – a sports car masterpiece that never gets old.', images: ['https://images.unsplash.com/photo-1619551734325-81aaf323686c?w=800&q=80'] },
  { name: 'BMW M4 Competition', brand: 'BMW', model: 'M4 Competition', year: 2024, pricePerDay: 18000, fuelType: 'Petrol', transmission: 'Auto', seats: 4, category: 'Luxury', rating: 4.7, totalReviews: 67, availability: 'Available', location: 'Pune, Maharashtra', features: ['Twin-Turbo I6', 'M Adaptive Suspension', 'Harman Kardon', 'Head-Up Display', 'GPS', 'Heated Seats'], description: 'The BMW M4 Competition blends everyday usability with heart-pounding performance.', images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'] },
  { name: 'Mercedes-Benz S-Class', brand: 'Mercedes', model: 'S 500', year: 2024, pricePerDay: 22000, fuelType: 'Petrol', transmission: 'Auto', seats: 5, category: 'Luxury', rating: 4.8, totalReviews: 54, availability: 'Available', location: 'Hyderabad, Telangana', features: ['Magic Body Control', 'Burmester 4D Sound', 'Augmented Reality Nav', 'Massage Seats', 'Ambient Lighting', 'Night Vision'], description: 'The epitome of luxury and technology. Experience the future with Mercedes S-Class.', images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80'] },
  { name: 'Audi R8 V10', brand: 'Audi', model: 'R8 V10 Plus', year: 2023, pricePerDay: 44900, fuelType: 'Petrol', transmission: 'Auto', seats: 2, category: 'Sports', rating: 4.8, totalReviews: 31, availability: 'Available', location: 'Chennai, Tamil Nadu', features: ['Naturally Aspirated V10', 'Quattro AWD', 'Magnetic Ride', 'Bang & Olufsen', 'Virtual Cockpit', 'Launch Control'], description: 'The Audi R8 V10 Plus offers supercar performance with everyday usability.', images: ['https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80'] },
  { name: 'Tesla Model S Plaid', brand: 'Tesla', model: 'Model S Plaid', year: 2024, pricePerDay: 15000, fuelType: 'Electric', transmission: 'Auto', seats: 5, category: 'Electric', rating: 4.7, totalReviews: 89, availability: 'Available', location: 'Mumbai, Maharashtra', features: ['Tri-Motor AWD', '1020 HP', '0-100 in 2.1s', 'Autopilot', '17" Touchscreen', 'Premium Audio', 'Full Self-Driving'], description: 'The fastest accelerating production car ever made. Zero emissions, infinite thrills.', images: ['https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80'] },
  { name: 'Range Rover Sport', brand: 'Land Rover', model: 'Range Rover Sport SVR', year: 2024, pricePerDay: 25000, fuelType: 'Petrol', transmission: 'Auto', seats: 5, category: 'SUV', rating: 4.6, totalReviews: 43, availability: 'Available', location: 'Gurgaon, Haryana', features: ['Supercharged V8', 'Terrain Response 2', 'Meridian Sound', 'Panoramic Roof', 'Air Suspension', 'Head-Up Display'], description: 'Unmatched off-road capability with supreme luxury. The Range Rover Sport SVR dominates any terrain.', images: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80'] },
  { name: 'Rolls-Royce Ghost', brand: 'Rolls-Royce', model: 'Ghost Extended', year: 2024, pricePerDay: 89900, fuelType: 'Petrol', transmission: 'Auto', seats: 5, category: 'Luxury', rating: 5.0, totalReviews: 12, availability: 'Available', location: 'Mumbai, Maharashtra', features: ['6.75L V12 Engine', 'Starlight Headliner', 'Bespoke Audio', 'Lambswool Floor Mats', 'Champagne Cooler', 'Rear Theatre'], description: 'The pinnacle of automotive luxury. Experience what it means to travel in absolute silence and opulence.', images: ['https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?w=800&q=80'] },
  { name: 'McLaren 720S', brand: 'McLaren', model: '720S Performance', year: 2023, pricePerDay: 54900, fuelType: 'Petrol', transmission: 'Auto', seats: 2, category: 'Sports', rating: 4.9, totalReviews: 19, availability: 'Available', location: 'Delhi, NCR', features: ['4.0L Twin-Turbo V8', 'Proactive Chassis Control', 'Electrochromic Roof', 'Bowers & Wilkins', 'Active Dynamics Panel'], description: 'Pure speed. Pure performance. The McLaren 720S is a hypercar for the road.', images: ['https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&q=80'] },
  { name: 'Bentley Continental GT', brand: 'Bentley', model: 'Continental GT V8', year: 2024, pricePerDay: 69900, fuelType: 'Petrol', transmission: 'Auto', seats: 4, category: 'Luxury', rating: 4.9, totalReviews: 22, availability: 'Available', location: 'Bangalore, Karnataka', features: ['4.0L V8 Biturbo', 'Naim Audio', 'Rotating Display', 'All-Wheel Drive', 'Heated & Cooled Seats', 'Diamond Knurling'], description: 'Grand touring in its finest form. The Bentley Continental GT combines performance with handcrafted luxury.', images: ['https://images.unsplash.com/photo-1617196034738-26c5f7c977ce?w=800&q=80'] },
  { name: 'Lamborghini Urus', brand: 'Lamborghini', model: 'Urus S', year: 2024, pricePerDay: 35000, fuelType: 'Petrol', transmission: 'Auto', seats: 5, category: 'SUV', rating: 4.8, totalReviews: 38, availability: 'Available', location: 'Mumbai, Maharashtra', features: ['4.0L V8 Biturbo', 'ANIMA System', 'Carbon Ceramic Brakes', 'Bang & Olufsen', 'Night Vision', 'Panoramic Roof'], description: 'The Super SUV. Lamborghini Urus delivers supercar performance in an SUV body.', images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'] },
];

const sampleCoupons = [
  { code: 'ROYAL20', discountType: 'percentage', discountValue: 20, minBookingAmount: 5000, maxDiscount: 5000, usageLimit: 500, expiryDate: new Date('2025-12-31') },
  { code: 'FIRST50', discountType: 'percentage', discountValue: 50, minBookingAmount: 10000, maxDiscount: 8000, usageLimit: 100, expiryDate: new Date('2025-12-31') },
  { code: 'LUXURY500', discountType: 'fixed', discountValue: 500, minBookingAmount: 3000, usageLimit: 200, expiryDate: new Date('2025-12-31') },
  { code: 'SAVE1000', discountType: 'fixed', discountValue: 1000, minBookingAmount: 8000, usageLimit: 150, expiryDate: new Date('2025-12-31') },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const carCount = await Car.countDocuments();
    if (carCount === 0) {
      await Car.insertMany(sampleCars);
      console.log(`✅ Seeded ${sampleCars.length} cars`);
    } else {
      console.log(`ℹ️  Cars already exist (${carCount}), skipping...`);
    }

    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      await Coupon.insertMany(sampleCoupons);
      console.log(`✅ Seeded ${sampleCoupons.length} coupons`);
    }

    const adminExists = await User.findOne({ email: 'admin@royalrent.com' });
    if (!adminExists) {
      await User.create({ name: 'Admin User', email: 'admin@royalrent.com', password: 'Admin@123', role: 'admin', isEmailVerified: true });
      console.log('✅ Admin created: admin@royalrent.com / Admin@123');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
