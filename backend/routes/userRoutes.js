import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserOrders,
  getUserRestaurant,
  getUserStats
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

// Profile management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/password', changePassword);

// User data
router.get('/orders', getUserOrders);
router.get('/stats', getUserStats);
router.get('/restaurant', getUserRestaurant);

export default router;

