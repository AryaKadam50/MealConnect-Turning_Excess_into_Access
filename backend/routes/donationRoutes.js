import { Router } from 'express';
import {
  submitDonation,
  getAllDonations,
  getDonationById,
  updateDonationStatus,
  deleteDonation
} from '../controllers/donationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// Public route - anyone can submit a donation
router.post('/', submitDonation);

// Admin routes - require authentication and admin role
router.use(protect, admin);
router.get('/', getAllDonations);
router.get('/:id', getDonationById);
router.put('/:id/status', updateDonationStatus);
router.delete('/:id', deleteDonation);

export default router;

