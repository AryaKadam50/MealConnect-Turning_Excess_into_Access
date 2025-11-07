import { Router } from 'express';
import {
  submitPartnership,
  getAllPartnerships,
  getPartnershipById,
  updatePartnershipStatus,
  deletePartnership
} from '../controllers/partnershipController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// Public route - anyone can submit partnership application
router.post('/', submitPartnership);

// Admin routes - require authentication and admin role
router.use(protect, admin);
router.get('/', getAllPartnerships);
router.get('/:id', getPartnershipById);
router.put('/:id/status', updatePartnershipStatus);
router.delete('/:id', deletePartnership);

export default router;

