import Car from '../models/Car.js';
import cloudinary from '../config/cloudinary.js';

export const getCars = async (req, res) => {
  try {
    const { brand, fuelType, transmission, seats, minPrice, maxPrice, availability, category, sort, page = 1, limit = 12, search } = req.query;
    const filter = { isActive: true };
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (fuelType) filter.fuelType = fuelType;
    if (transmission) filter.transmission = transmission;
    if (seats) filter.seats = Number(seats);
    if (availability) filter.availability = availability;
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.pricePerDay = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { brand: { $regex: search, $options: 'i' } }, { model: { $regex: search, $options: 'i' } }];

    let sortObj = { createdAt: -1 };
    if (sort === 'price_asc') sortObj = { pricePerDay: 1 };
    else if (sort === 'price_desc') sortObj = { pricePerDay: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };

    const total = await Car.countDocuments(filter);
    const cars = await Car.find(filter).sort(sortObj).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, cars, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ isActive: true, availability: 'Available' }).sort({ rating: -1 }).limit(8);
    res.json({ success: true, cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const carData = { ...req.body };
    if (req.files?.length) carData.images = req.files.map(f => f.path);
    if (typeof carData.features === 'string') carData.features = carData.features.split(',').map(f => f.trim());
    const car = await Car.create(carData);
    res.status(201).json({ success: true, message: 'Car added successfully', car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.files?.length) updateData.images = req.files.map(f => f.path);
    if (typeof updateData.features === 'string') updateData.features = updateData.features.split(',').map(f => f.trim());
    const car = await Car.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Car updated', car });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    res.json({ success: true, message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Car.distinct('brand');
    res.json({ success: true, brands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
