import asyncHandler from 'express-async-handler';
import Restaurant from '../models/Restaurant.js';

export const listRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({}).sort({ createdAt: -1 });
  res.json(restaurants);
});

export const createRestaurant = asyncHandler(async (req, res) => {
  const { name, location, contact, image } = req.body;
  const userId = req.user._id;
  
  // Validation
  if (!name || !location) {
    return res.status(400).json({ message: 'Restaurant name and location are required' });
  }
  
  // Check if user already has a restaurant
  const existing = await Restaurant.findOne({ user: userId });
  if (existing) {
    return res.status(400).json({ message: 'User already has a restaurant. Please update it instead.' });
  }
  
  const restaurant = await Restaurant.create({ name, location, contact, image, user: userId });
  res.status(201).json(restaurant);
});

// Get restaurant for the logged-in user
export const getMyRestaurant = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const restaurant = await Restaurant.findOne({ user: userId });
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found. Please create one first.' });
  }
  
  res.json(restaurant);
});

// Update restaurant for the logged-in user
export const updateMyRestaurant = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, location, contact, image } = req.body;
  
  const restaurant = await Restaurant.findOneAndUpdate(
    { user: userId },
    { name, location, contact, image },
    { new: true, runValidators: true }
  );
  
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant not found' });
  }
  
  res.json(restaurant);
});


