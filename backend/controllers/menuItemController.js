import asyncHandler from 'express-async-handler';
import MenuItem from '../models/MenuItem.js';

export const listByRestaurant = asyncHandler(async (req, res) => {
  const { restaurantId } = req.params;
  const items = await MenuItem.find({ restaurant: restaurantId }).sort({ createdAt: -1 });
  res.json(items);
});

export const createMenuItem = asyncHandler(async (req, res) => {
  const { name, quantity, category, expiryTime, image: imageUrl } = req.body;
  
  // Validation
  if (!name || !quantity || !category) {
    return res.status(400).json({ message: 'Name, quantity, and category are required' });
  }
  
  // Use uploaded file if available, otherwise use URL from body, or empty string
  const image = req.file ? `/uploads/menu-items/${req.file.filename}` : (imageUrl || '');
  
  // If user is restaurant/ngo, get their restaurant automatically
  let restaurantId = req.body.restaurant;
  
  if (!restaurantId && (req.user.role === 'restaurant' || req.user.role === 'ngo')) {
    const Restaurant = (await import('../models/Restaurant.js')).default;
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) {
      return res.status(400).json({ message: 'Please create your restaurant profile first' });
    }
    restaurantId = restaurant._id;
  }
  
  if (!restaurantId) {
    return res.status(400).json({ message: 'Restaurant ID is required' });
  }
  
  // Verify restaurant exists
  const Restaurant = (await import('../models/Restaurant.js')).default;
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }
  
  const item = await MenuItem.create({ restaurant: restaurantId, name, quantity, category, expiryTime, image, status: 'available' });
  res.status(201).json(item);
});

export const updateMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { image: imageUrl, ...restBody } = req.body;
  
  // Check if menu item exists
  const existingItem = await MenuItem.findById(id);
  if (!existingItem) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  // Verify ownership if user is restaurant/ngo
  if (req.user.role === 'restaurant' || req.user.role === 'ngo') {
    const Restaurant = (await import('../models/Restaurant.js')).default;
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant || existingItem.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
  }
  
  const updateData = { ...restBody };
  
  // If a new image file was uploaded, use it, otherwise use URL if provided
  if (req.file) {
    updateData.image = `/uploads/menu-items/${req.file.filename}`;
  } else if (imageUrl !== undefined) {
    updateData.image = imageUrl;
  }
  
  const item = await MenuItem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  res.json(item);
});

export const deleteMenuItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const item = await MenuItem.findById(id);
  if (!item) {
    return res.status(404).json({ message: 'Menu item not found' });
  }
  
  // Verify ownership if user is restaurant/ngo
  if (req.user.role === 'restaurant' || req.user.role === 'ngo') {
    const Restaurant = (await import('../models/Restaurant.js')).default;
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant || item.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
  }
  
  await MenuItem.findByIdAndDelete(id);
  res.json({ message: 'Menu item deleted successfully' });
});

export const listAll = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ status: 'available' }).populate('restaurant');
  res.json(items);
});

// Get menu items for logged-in restaurant/ngo
export const getMyMenuItems = asyncHandler(async (req, res) => {
  const Restaurant = (await import('../models/Restaurant.js')).default;
  const restaurant = await Restaurant.findOne({ user: req.user._id });
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found. Please create one first.' });
  }
  
  const items = await MenuItem.find({ restaurant: restaurant._id }).sort({ createdAt: -1 });
  res.json(items);
});


