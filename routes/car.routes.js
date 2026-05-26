import express from 'express';
import { getCars, getCarById, getFeaturedCars, createCar, updateCar, deleteCar, getBrands } from '../controllers/car.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getCars);
router.get('/featured', getFeaturedCars);
router.get('/brands', getBrands);
router.get('/:id', getCarById);
router.post('/', protect, adminOnly, upload.array('images', 10), createCar);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

export default router;
