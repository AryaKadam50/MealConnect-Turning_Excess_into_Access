import asyncHandler from 'express-async-handler';
import PickupRequest from '../models/PickupRequest.js';
import User from '../models/User.js';

export const createPickup = asyncHandler(async (req, res) => {
  const { items, paymentMethod, totalAmount } = req.body;
  
  // Validate items array
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Items array is required and cannot be empty' });
  }
  
  // Validate each item has required fields
  for (const item of items) {
    if (!item.menuItem || !item.restaurant || !item.quantity) {
      return res.status(400).json({ message: 'Each item must have menuItem, restaurant, and quantity' });
    }
    if (item.quantity <= 0) {
      return res.status(400).json({ message: 'Item quantity must be greater than 0' });
    }
  }
  
  const user = await User.findById(req.user._id);
  
  const request = await PickupRequest.create({ 
    items, 
    requestedBy: req.user._id,
    requesterName: user.name,
    requesterEmail: user.email,
    paymentStatus: 'completed', // Payment is completed before request
    paymentMethod: paymentMethod || 'online',
    totalAmount: totalAmount || 0
  });
  
  // Populate for better response
  await request.populate('items.restaurant', 'name location');
  await request.populate('items.menuItem');
  
  res.status(201).json(request);
});

export const listPickups = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find({})
    .populate('requestedBy', 'name email')
    .populate('items.menuItem')
    .populate('items.restaurant')
    .sort({ createdAt: -1 });
  res.json(pickups);
});

// Get pickup requests for a specific restaurant
export const getRestaurantPickups = asyncHandler(async (req, res) => {
  const Restaurant = (await import('../models/Restaurant.js')).default;
  const restaurant = await Restaurant.findOne({ user: req.user._id });
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }
  
  const pickups = await PickupRequest.find({
    'items.restaurant': restaurant._id,
    status: { $in: ['pending', 'accepted'] }
  })
    .populate('requestedBy', 'name email')
    .populate('items.menuItem')
    .sort({ createdAt: -1 });
  
  res.json(pickups);
});

// Get pickup requests for logged-in user
export const getMyPickups = asyncHandler(async (req, res) => {
  const pickups = await PickupRequest.find({ requestedBy: req.user._id })
    .populate('items.menuItem')
    .populate('items.restaurant', 'name location')
    .sort({ createdAt: -1 });
  res.json(pickups);
});

// Get a single pickup request by ID
export const getPickupById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pickup = await PickupRequest.findById(id)
    .populate('requestedBy', 'name email')
    .populate('items.menuItem')
    .populate('items.restaurant', 'name location');
  
  if (!pickup) {
    return res.status(404).json({ message: 'Pickup request not found' });
  }
  
  // Check if user is authorized to view this pickup
  if (req.user.role !== 'admin' && 
      pickup.requestedBy._id.toString() !== req.user._id.toString()) {
    // Check if user owns a restaurant with items in this pickup
    const Restaurant = (await import('../models/Restaurant.js')).default;
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    
    if (!restaurant || !pickup.items.some(item => 
      item.restaurant.toString() === restaurant._id.toString()
    )) {
      return res.status(403).json({ message: 'Not authorized' });
    }
  }
  
  res.json(pickup);
});

// Cancel a pickup request (user can cancel their own)
export const cancelPickup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pickup = await PickupRequest.findById(id);
  
  if (!pickup) {
    return res.status(404).json({ message: 'Pickup request not found' });
  }
  
  // Check if user is authorized (only the requester can cancel)
  if (pickup.requestedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  // Only allow canceling if status is pending
  if (pickup.status !== 'pending') {
    return res.status(400).json({ message: 'Can only cancel pending requests' });
  }
  
  pickup.status = 'cancelled';
  await pickup.save();
  
  res.json(pickup);
});

// Update pickup request status (accept/reject)
export const updatePickupStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const Restaurant = (await import('../models/Restaurant.js')).default;
  const restaurant = await Restaurant.findOne({ user: req.user._id });
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }
  
  const pickup = await PickupRequest.findById(id);
  if (!pickup) {
    return res.status(404).json({ message: 'Pickup request not found' });
  }
  
  // Verify this pickup request contains items from this restaurant
  const hasRestaurantItems = pickup.items.some(
    item => item.restaurant.toString() === restaurant._id.toString()
  );
  
  if (!hasRestaurantItems) {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  pickup.status = status;
  await pickup.save();
  
  res.json(pickup);
});


