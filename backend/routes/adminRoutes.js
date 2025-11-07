import { Router } from 'express';
import {
  getDashboardStats,
  getAllRestaurants,
  getAllUsers,
  getAllPickups,
  getAllMenuItems,
  getAllVolunteers,
  getAllPartnerships,
  getAllDonations,
  getRestaurantDetails,
  updateUserRole,
  deleteUser,
  deleteRestaurant,
  updateVolunteerStatus,
  deleteVolunteer,
  deleteMenuItem,
  getPickupDetails,
  updatePickupStatus,
  updatePartnershipStatus,
  deletePartnership,
  updateDonationStatus,
  deleteDonation
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// Get all data
router.get('/restaurants', getAllRestaurants);
router.get('/users', getAllUsers);
router.get('/pickups', getAllPickups);
router.get('/menu-items', getAllMenuItems);
router.get('/volunteers', getAllVolunteers);
router.get('/partnerships', getAllPartnerships);
router.get('/donations', getAllDonations);

// Restaurant management
router.get('/restaurants/:id', getRestaurantDetails);
router.delete('/restaurants/:id', deleteRestaurant);

// User management
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Pickup management
router.get('/pickups/:id', getPickupDetails);
router.put('/pickups/:id/status', updatePickupStatus);

// Menu item management
router.delete('/menu-items/:id', deleteMenuItem);

// Volunteer management
router.put('/volunteers/:id/status', updateVolunteerStatus);
router.delete('/volunteers/:id', deleteVolunteer);

// Partnership management
router.put('/partnerships/:id/status', updatePartnershipStatus);
router.delete('/partnerships/:id', deletePartnership);

// Donation management
router.put('/donations/:id/status', updateDonationStatus);
router.delete('/donations/:id', deleteDonation);

export default router;

