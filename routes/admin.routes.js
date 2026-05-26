import express from 'express';
import { getDashboardStats, getUsers, toggleBlockUser } from '../controllers/admin.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.patch('/users/:id/block', toggleBlockUser);

export default router;
