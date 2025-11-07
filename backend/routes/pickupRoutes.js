import { Router } from 'express';
import { createPickup, listPickups, getRestaurantPickups, updatePickupStatus, getMyPickups, getPickupById, cancelPickup } from '../controllers/pickupController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, createPickup);
router.get('/', listPickups);
router.get('/my-orders', protect, getMyPickups);
router.get('/my-restaurant', protect, getRestaurantPickups);
router.get('/:id', protect, getPickupById);
router.put('/:id/status', protect, updatePickupStatus);
router.put('/:id/cancel', protect, cancelPickup);

export default router;


