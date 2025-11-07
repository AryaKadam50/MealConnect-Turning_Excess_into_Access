import { Router } from 'express';
import { listByRestaurant, createMenuItem, updateMenuItem, deleteMenuItem, listAll, getMyMenuItems } from '../controllers/menuItemController.js';
import { uploadMenuItemImage } from '../middleware/uploadMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', listAll);
router.get('/restaurant/:restaurantId', listByRestaurant);
router.get('/my-items', protect, getMyMenuItems);
router.post('/', protect, uploadMenuItemImage, createMenuItem);
router.put('/:id', protect, uploadMenuItemImage, updateMenuItem);
router.delete('/:id', protect, deleteMenuItem);

export default router;


