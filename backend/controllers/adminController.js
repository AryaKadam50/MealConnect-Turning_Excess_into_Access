import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import PickupRequest from '../models/PickupRequest.js';
import VolunteerApplication from '../models/VolunteerApplication.js';
import Partnership from '../models/Partnership.js';
import Donation from '../models/Donation.js';

// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalRestaurants,
    totalMenuItems,
    totalPickups,
    totalVolunteers,
    totalPartnerships,
    totalDonations,
    activeMenuItems,
    pendingPickups,
    completedPickups,
    pendingPartnerships,
    activePartnerships,
    completedDonations,
    pendingDonations
  ] = await Promise.all([
    User.countDocuments(),
    Restaurant.countDocuments(),
    MenuItem.countDocuments(),
    PickupRequest.countDocuments(),
    VolunteerApplication.countDocuments(),
    Partnership.countDocuments(),
    Donation.countDocuments(),
    MenuItem.countDocuments({ status: 'available' }),
    PickupRequest.countDocuments({ status: 'pending' }),
    PickupRequest.countDocuments({ status: 'completed' }),
    Partnership.countDocuments({ status: 'pending' }),
    Partnership.countDocuments({ status: 'active' }),
    Donation.countDocuments({ paymentStatus: 'completed', status: 'active' }),
    Donation.countDocuments({ paymentStatus: 'pending' })
  ]);

  // Get users by role
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  // Get total donation value (sum of all pickup amounts + standalone donations)
  const [pickupDonationsStats, standaloneDonationsStats] = await Promise.all([
    PickupRequest.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $ifNull: ['$totalAmount', 0] } },
          totalPickups: { $sum: 1 }
        }
      }
    ]),
    Donation.aggregate([
      {
        $match: { status: 'active', paymentStatus: 'completed' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: { $ifNull: ['$amount', 0] } },
          totalDonations: { $sum: 1 }
        }
      }
    ])
  ]);

  const pickupTotal = pickupDonationsStats[0]?.totalAmount || 0;
  const standaloneTotal = standaloneDonationsStats[0]?.totalAmount || 0;
  const totalDonationAmount = pickupTotal + standaloneTotal;

  const stats = {
    users: {
      total: totalUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    },
    restaurants: {
      total: totalRestaurants
    },
    menuItems: {
      total: totalMenuItems,
      active: activeMenuItems
    },
    pickups: {
      total: totalPickups,
      pending: pendingPickups,
      completed: completedPickups
    },
    volunteers: {
      total: totalVolunteers
    },
    partnerships: {
      total: totalPartnerships,
      pending: pendingPartnerships,
      active: activePartnerships
    },
    donations: {
      totalAmount: totalDonationAmount,
      totalPickups: pickupDonationsStats[0]?.totalPickups || 0,
      totalStandaloneDonations: standaloneDonationsStats[0]?.totalDonations || 0,
      total: totalDonations,
      completed: completedDonations,
      pending: pendingDonations
    }
  };

  res.json(stats);
});

// Get all restaurants with details
export const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({})
    .populate('user', 'name email role')
    .sort({ createdAt: -1 });
  res.json(restaurants);
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(users);
});

// Get all pickup requests with full details
export const getAllPickups = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find({})
    .populate('requestedBy', 'name email role')
    .populate('items.menuItem')
    .populate('items.restaurant', 'name location')
    .sort({ createdAt: -1 });
  res.json(pickups);
});

// Get all menu items
export const getAllMenuItems = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({})
    .populate('restaurant', 'name location')
    .sort({ createdAt: -1 });
  res.json(items);
});

// Get all volunteer applications
export const getAllVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await VolunteerApplication.find({})
    .sort({ createdAt: -1 });
  res.json(volunteers);
});

// Get all partnerships
export const getAllPartnerships = asyncHandler(async (req, res) => {
  const partnerships = await Partnership.find({})
    .populate('approvedBy', 'name email')
    .sort({ createdAt: -1 });
  res.json(partnerships);
});

// Get all donations
export const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({})
    .sort({ createdAt: -1 });
  res.json(donations);
});

// Get restaurant details with stats
export const getRestaurantDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const restaurant = await Restaurant.findById(id)
    .populate('user', 'name email role');
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  const [menuItems, pickups, totalDonations] = await Promise.all([
    MenuItem.countDocuments({ restaurant: id }),
    PickupRequest.countDocuments({ 'items.restaurant': id }),
    PickupRequest.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.restaurant': restaurant._id } },
      { 
        $group: { 
          _id: null, 
          total: { 
            $sum: { 
              $multiply: [
                { $ifNull: ['$items.itemPrice', 0] }, 
                { $ifNull: ['$items.quantity', 0] }
              ] 
            } 
          } 
        } 
      }
    ])
  ]);

  res.json({
    restaurant,
    stats: {
      menuItems,
      totalPickups: pickups,
      totalDonations: totalDonations[0]?.total || 0
    }
  });
});

// Update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['user', 'ngo', 'restaurant', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Prevent deleting yourself
  if (id === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await User.findByIdAndDelete(id);
  res.json({ message: 'User deleted successfully' });
});

// Delete restaurant
export const deleteRestaurant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  // Also delete associated menu items
  await MenuItem.deleteMany({ restaurant: id });
  await Restaurant.findByIdAndDelete(id);

  res.json({ message: 'Restaurant and associated items deleted successfully' });
});

// Update volunteer application status
export const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['submitted', 'verified', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const volunteer = await VolunteerApplication.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer application not found' });
  }

  res.json(volunteer);
});

// Delete volunteer application
export const deleteVolunteer = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const volunteer = await VolunteerApplication.findById(id);
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer application not found' });
  }

  await VolunteerApplication.findByIdAndDelete(id);
  res.json({ message: 'Volunteer application deleted successfully' });
});

// Delete menu item
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await MenuItem.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Menu item not found' });
  }

  await MenuItem.findByIdAndDelete(id);
  res.json({ message: 'Menu item deleted successfully' });
});

// Get pickup details
export const getPickupDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pickup = await PickupRequest.findById(id)
    .populate('requestedBy', 'name email role')
    .populate('items.menuItem')
    .populate('items.restaurant', 'name location contact');

  if (!pickup) {
    return res.status(404).json({ message: 'Pickup request not found' });
  }

  res.json(pickup);
});

// Update pickup status (admin can force update)
export const updatePickupStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'accepted', 'rejected', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const pickup = await PickupRequest.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  )
    .populate('requestedBy', 'name email')
    .populate('items.menuItem')
    .populate('items.restaurant', 'name location');

  if (!pickup) {
    return res.status(404).json({ message: 'Pickup request not found' });
  }

  res.json(pickup);
});

// Update partnership status
export const updatePartnershipStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'active', 'inactive'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updateData = { status };
  
  // Add notes if provided
  if (notes !== undefined) {
    updateData.notes = notes;
  }

  // If approving, set approvedBy and approvedAt
  if (status === 'approved' || status === 'active') {
    updateData.approvedBy = req.user._id;
    updateData.approvedAt = new Date();
  }

  const partnership = await Partnership.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('approvedBy', 'name email');

  if (!partnership) {
    return res.status(404).json({ message: 'Partnership not found' });
  }

  res.json(partnership);
});

// Delete partnership
export const deletePartnership = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const partnership = await Partnership.findById(id);
  if (!partnership) {
    return res.status(404).json({ message: 'Partnership not found' });
  }

  await Partnership.findByIdAndDelete(id);
  res.json({ message: 'Partnership deleted successfully' });
});

// Update donation status
export const updateDonationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { paymentStatus, status, notes } = req.body;

  const updateData = {};

  if (paymentStatus) {
    const validPaymentStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    updateData.paymentStatus = paymentStatus;
  }

  if (status) {
    const validStatuses = ['active', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    updateData.status = status;
  }

  if (notes !== undefined) {
    updateData.notes = notes;
  }

  const donation = await Donation.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  res.json(donation);
});

// Delete donation
export const deleteDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const donation = await Donation.findById(id);
  if (!donation) {
    return res.status(404).json({ message: 'Donation not found' });
  }

  await Donation.findByIdAndDelete(id);
  res.json({ message: 'Donation deleted successfully' });
});

