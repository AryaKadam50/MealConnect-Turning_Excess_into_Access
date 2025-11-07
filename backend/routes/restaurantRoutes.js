import { Router } from 'express';
import { listRestaurants, createRestaurant, getMyRestaurant, updateMyRestaurant } from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listRestaurants);
router.post('/', protect, createRestaurant);
router.get('/my-restaurant', protect, getMyRestaurant);
router.put('/my-restaurant', protect, updateMyRestaurant);

export default router;


