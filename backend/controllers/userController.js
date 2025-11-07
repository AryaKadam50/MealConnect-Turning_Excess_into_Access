import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import PickupRequest from '../models/PickupRequest.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Check if email is already taken by another user
  const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use by another account' });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true }
  ).select('-password');

  res.json(user);
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  const user = await User.findById(req.user._id);

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

// Get user's orders/pickup requests
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await PickupRequest.find({ requestedBy: req.user._id })
    .populate('items.menuItem')
    .populate('items.restaurant', 'name location')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// Get user's restaurant (if they are a restaurant owner)
export const getUserRestaurant = asyncHandler(async (req, res) => {
  if (req.user.role !== 'restaurant' && req.user.role !== 'ngo') {
    return res.status(403).json({ message: 'You are not a restaurant owner' });
  }

  const restaurant = await Restaurant.findOne({ user: req.user._id })
    .populate('user', 'name email');

  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }

  // Get restaurant stats
  const [menuItemsCount, totalPickups, completedPickups] = await Promise.all([
    MenuItem.countDocuments({ restaurant: restaurant._id }),
    PickupRequest.countDocuments({ 'items.restaurant': restaurant._id }),
    PickupRequest.countDocuments({ 
      'items.restaurant': restaurant._id,
      status: 'completed'
    })
  ]);

  res.json({
    restaurant,
    stats: {
      menuItems: menuItemsCount,
      totalPickups,
      completedPickups
    }
  });
});

// Get user statistics
export const getUserStats = asyncHandler(async (req, res) => {
  const [totalOrders, completedOrders, pendingOrders, totalSpent] = await Promise.all([
    PickupRequest.countDocuments({ requestedBy: req.user._id }),
    PickupRequest.countDocuments({ requestedBy: req.user._id, status: 'completed' }),
    PickupRequest.countDocuments({ requestedBy: req.user._id, status: 'pending' }),
    PickupRequest.aggregate([
      { $match: { requestedBy: req.user._id } },
      { $group: { _id: null, total: { $sum: { $ifNull: ['$totalAmount', 0] } } } }
    ])
  ]);

  // Get restaurant stats if user is restaurant/ngo
  let restaurantStats = null;
  if (req.user.role === 'restaurant' || req.user.role === 'ngo') {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (restaurant) {
      const [menuItems, restaurantPickups] = await Promise.all([
        MenuItem.countDocuments({ restaurant: restaurant._id }),
        PickupRequest.countDocuments({ 'items.restaurant': restaurant._id })
      ]);
      restaurantStats = {
        menuItems,
        totalPickups: restaurantPickups
      };
    }
  }

  res.json({
    orders: {
      total: totalOrders,
      completed: completedOrders,
      pending: pendingOrders
    },
    totalSpent: totalSpent[0]?.total || 0,
    restaurant: restaurantStats
  });
});

