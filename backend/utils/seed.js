import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

await connectDB();

// Clear existing data
await User.deleteMany();
await Restaurant.deleteMany();
await MenuItem.deleteMany();

// Create sample users
const users = await User.insertMany([
  { name: 'Admin User', email: 'admin@mealconnect.com', password: 'admin123', role: 'admin' },
  { name: 'Restaurant Owner 1', email: 'restaurant1@mealconnect.com', password: 'rest123', role: 'restaurant' },
  { name: 'Restaurant Owner 2', email: 'restaurant2@mealconnect.com', password: 'rest123', role: 'restaurant' },
  { name: 'NGO User', email: 'ngo@mealconnect.com', password: 'ngo123', role: 'ngo' },
  { name: 'Regular User', email: 'user@mealconnect.com', password: 'user123', role: 'user' }
]);

console.log('Created sample users');

// Create restaurants linked to users
const restaurants = await Restaurant.insertMany([
  { name: 'Spice Garden', location: 'Indiranagar, Bengaluru', contact: '+91 98765 12345', image: '🌶️', user: users[1]._id },
  { name: 'Curry House', location: 'Koramangala, Bengaluru', contact: '+91 98765 12346', image: '🍛', user: users[2]._id },
  { name: 'Dosa Palace', location: 'Jayanagar, Bengaluru', contact: '+91 98765 12347', image: '🥞', user: users[1]._id },
  { name: 'Street Bites', location: 'MG Road, Bengaluru', contact: '+91 98765 12348', image: '🌮', user: users[3]._id },
  { name: 'Tandoor Junction', location: 'HSR Layout, Bengaluru', contact: '+91 98765 12349', image: '🫓', user: users[2]._id },
  { name: 'Biryani House', location: 'Whitefield, Bengaluru', contact: '+91 98765 12350', image: '🍚', user: users[1]._id }
]);

console.log('Created restaurants linked to users');

const r = (name) => restaurants.find(x => x.name === name)._id;

// Helper function to get food image URL based on item name
const getFoodImage = (name) => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('paneer')) return 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop';
  if (nameLower.includes('dal')) return 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d1?w=400&h=300&fit=crop';
  if (nameLower.includes('biryani')) return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop';
  if (nameLower.includes('chicken')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop';
  if (nameLower.includes('mutton')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop';
  if (nameLower.includes('dosa') || nameLower.includes('idli')) return 'https://images.unsplash.com/photo-1610192244275-02b89b0c27c9?w=400&h=300&fit=crop';
  if (nameLower.includes('naan') || nameLower.includes('roti') || nameLower.includes('paratha') || nameLower.includes('kulcha')) return 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop';
  if (nameLower.includes('samosa') || nameLower.includes('vada')) return 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop';
  if (nameLower.includes('pav') || nameLower.includes('bhaji')) return 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=400&h=300&fit=crop';
  if (nameLower.includes('tandoori') || nameLower.includes('tikka') || nameLower.includes('kebab')) return 'https://images.unsplash.com/photo-1626082895278-c69e42d613e0?w=400&h=300&fit=crop';
  if (nameLower.includes('jamun') || nameLower.includes('kheer') || nameLower.includes('rasgulla') || nameLower.includes('jalebi') || nameLower.includes('pak') || nameLower.includes('ice cream')) return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop';
  if (nameLower.includes('lassi') || nameLower.includes('shake') || nameLower.includes('coffee') || nameLower.includes('lemonade') || nameLower.includes('buttermilk') || nameLower.includes('jal')) return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop';
  if (nameLower.includes('rice') || nameLower.includes('pulao')) return 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop';
  if (nameLower.includes('curry') || nameLower.includes('masala') || nameLower.includes('gobi') || nameLower.includes('aloo') || nameLower.includes('chana') || nameLower.includes('palak')) return 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop';
  if (nameLower.includes('raita') || nameLower.includes('pickle') || nameLower.includes('sambar') || nameLower.includes('salad')) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
  if (nameLower.includes('chole') || nameLower.includes('rajma')) return 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop';
  if (nameLower.includes('chaat') || nameLower.includes('puri') || nameLower.includes('bhel')) return 'https://images.unsplash.com/photo-1633613286991-611fe299c4be?w=400&h=300&fit=crop';
  if (nameLower.includes('fish')) return 'https://images.unsplash.com/photo-1544943910-4c01d3c6f8eb?w=400&h=300&fit=crop';
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'; // Default food image
};

await MenuItem.insertMany([
  // Spice Garden - Main Course
  { restaurant: r('Spice Garden'), name: 'Paneer Butter Masala', quantity: '12 portions', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Paneer Butter Masala') },
  { restaurant: r('Spice Garden'), name: 'Dal Tadka', quantity: '15 portions', category: 'Main Course', expiryTime: '9:30 PM', image: getFoodImage('Dal Tadka') },
  { restaurant: r('Spice Garden'), name: 'Palak Paneer', quantity: '10 portions', category: 'Main Course', expiryTime: '8:45 PM', image: getFoodImage('Palak Paneer') },
  { restaurant: r('Spice Garden'), name: 'Chana Masala', quantity: '8 portions', category: 'Main Course', expiryTime: '8:30 PM', image: getFoodImage('Chana Masala') },
  { restaurant: r('Spice Garden'), name: 'Aloo Gobi', quantity: '14 portions', category: 'Main Course', expiryTime: '9:15 PM', image: getFoodImage('Aloo Gobi') },
  { restaurant: r('Spice Garden'), name: 'Mix Vegetable Curry', quantity: '16 portions', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Mix Vegetable Curry') },
  
  // Spice Garden - Rice
  { restaurant: r('Spice Garden'), name: 'Vegetable Biryani', quantity: '8 portions', category: 'Rice', expiryTime: '8:45 PM', image: getFoodImage('Vegetable Biryani') },
  { restaurant: r('Spice Garden'), name: 'Jeera Rice', quantity: '20 portions', category: 'Rice', expiryTime: '9:00 PM', image: getFoodImage('Jeera Rice') },
  { restaurant: r('Spice Garden'), name: 'Pulao', quantity: '12 portions', category: 'Rice', expiryTime: '8:30 PM', image: getFoodImage('Pulao') },
  
  // Spice Garden - Bread
  { restaurant: r('Spice Garden'), name: 'Garlic Naan', quantity: '25 pieces', category: 'Bread', expiryTime: '8:00 PM', image: getFoodImage('Garlic Naan') },
  { restaurant: r('Spice Garden'), name: 'Butter Roti', quantity: '30 pieces', category: 'Bread', expiryTime: '8:30 PM', image: getFoodImage('Butter Roti') },
  
  // Spice Garden - Side Dish
  { restaurant: r('Spice Garden'), name: 'Raita', quantity: '18 portions', category: 'Side Dish', expiryTime: '9:30 PM', image: getFoodImage('Raita') },
  { restaurant: r('Spice Garden'), name: 'Pickle', quantity: '10 portions', category: 'Side Dish', expiryTime: '10:00 PM', image: getFoodImage('Pickle') },
  
  // Curry House - Main Course
  { restaurant: r('Curry House'), name: 'Chicken Curry', quantity: '12 portions', category: 'Main Course', expiryTime: '9:30 PM', image: getFoodImage('Chicken Curry') },
  { restaurant: r('Curry House'), name: 'Mutton Curry', quantity: '6 portions', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Mutton Curry') },
  { restaurant: r('Curry House'), name: 'Butter Chicken', quantity: '10 portions', category: 'Main Course', expiryTime: '9:15 PM', image: getFoodImage('Butter Chicken') },
  { restaurant: r('Curry House'), name: 'Chicken Tikka Masala', quantity: '8 portions', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Chicken Tikka Masala') },
  { restaurant: r('Curry House'), name: 'Fish Curry', quantity: '7 portions', category: 'Main Course', expiryTime: '8:45 PM', image: getFoodImage('Fish Curry') },
  
  // Curry House - Bread
  { restaurant: r('Curry House'), name: 'Plain Naan', quantity: '20 pieces', category: 'Bread', expiryTime: '9:00 PM', image: getFoodImage('Plain Naan') },
  { restaurant: r('Curry House'), name: 'Butter Naan', quantity: '18 pieces', category: 'Bread', expiryTime: '9:00 PM', image: getFoodImage('Butter Naan') },
  { restaurant: r('Curry House'), name: 'Kulcha', quantity: '15 pieces', category: 'Bread', expiryTime: '8:45 PM', image: getFoodImage('Kulcha') },
  { restaurant: r('Curry House'), name: 'Paratha', quantity: '12 pieces', category: 'Bread', expiryTime: '8:30 PM', image: getFoodImage('Paratha') },
  
  // Curry House - Rice
  { restaurant: r('Curry House'), name: 'Chicken Biryani', quantity: '10 portions', category: 'Rice', expiryTime: '9:15 PM', image: getFoodImage('Chicken Biryani') },
  { restaurant: r('Curry House'), name: 'Mutton Biryani', quantity: '8 portions', category: 'Rice', expiryTime: '9:00 PM', image: getFoodImage('Mutton Biryani') },
  
  // Dosa Palace - Main Course
  { restaurant: r('Dosa Palace'), name: 'Masala Dosa', quantity: '25 pieces', category: 'Main Course', expiryTime: '8:00 PM', image: getFoodImage('Masala Dosa') },
  { restaurant: r('Dosa Palace'), name: 'Plain Dosa', quantity: '30 pieces', category: 'Main Course', expiryTime: '8:15 PM', image: getFoodImage('Plain Dosa') },
  { restaurant: r('Dosa Palace'), name: 'Onion Dosa', quantity: '20 pieces', category: 'Main Course', expiryTime: '8:00 PM', image: getFoodImage('Onion Dosa') },
  { restaurant: r('Dosa Palace'), name: 'Rava Dosa', quantity: '15 pieces', category: 'Main Course', expiryTime: '8:30 PM', image: getFoodImage('Rava Dosa') },
  { restaurant: r('Dosa Palace'), name: 'Idli', quantity: '40 pieces', category: 'Main Course', expiryTime: '8:00 PM', image: getFoodImage('Idli') },
  { restaurant: r('Dosa Palace'), name: 'Vada', quantity: '35 pieces', category: 'Snacks', expiryTime: '7:45 PM', image: getFoodImage('Vada') },
  { restaurant: r('Dosa Palace'), name: 'Sambar', quantity: '25 portions', category: 'Side Dish', expiryTime: '8:30 PM', image: getFoodImage('Sambar') },
  
  // Dosa Palace - Rice
  { restaurant: r('Dosa Palace'), name: 'Lemon Rice', quantity: '18 portions', category: 'Rice', expiryTime: '8:15 PM', image: getFoodImage('Lemon Rice') },
  { restaurant: r('Dosa Palace'), name: 'Tamato Rice', quantity: '15 portions', category: 'Rice', expiryTime: '8:00 PM', image: getFoodImage('Tamato Rice') },
  { restaurant: r('Dosa Palace'), name: 'Coconut Rice', quantity: '12 portions', category: 'Rice', expiryTime: '8:30 PM', image: getFoodImage('Coconut Rice') },
  
  // Street Bites - Snacks
  { restaurant: r('Street Bites'), name: 'Pav Bhaji', quantity: '15 portions', category: 'Snacks', expiryTime: '9:00 PM', image: getFoodImage('Pav Bhaji') },
  { restaurant: r('Street Bites'), name: 'Vada Pav', quantity: '20 pieces', category: 'Snacks', expiryTime: '8:30 PM', image: getFoodImage('Vada Pav') },
  { restaurant: r('Street Bites'), name: 'Samosa', quantity: '30 pieces', category: 'Snacks', expiryTime: '8:00 PM', image: getFoodImage('Samosa') },
  { restaurant: r('Street Bites'), name: 'Bhel Puri', quantity: '18 portions', category: 'Snacks', expiryTime: '8:45 PM', image: getFoodImage('Bhel Puri') },
  { restaurant: r('Street Bites'), name: 'Pani Puri', quantity: '25 portions', category: 'Snacks', expiryTime: '9:00 PM', image: getFoodImage('Pani Puri') },
  { restaurant: r('Street Bites'), name: 'Chaat', quantity: '20 portions', category: 'Snacks', expiryTime: '8:30 PM', image: getFoodImage('Chaat') },
  
  // Street Bites - Main Course
  { restaurant: r('Street Bites'), name: 'Rajma Chawal', quantity: '12 portions', category: 'Main Course', expiryTime: '9:15 PM', image: getFoodImage('Rajma Chawal') },
  { restaurant: r('Street Bites'), name: 'Chole Bhature', quantity: '10 portions', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Chole Bhature') },
  
  // Tandoor Junction - Main Course
  { restaurant: r('Tandoor Junction'), name: 'Tandoori Chicken', quantity: '14 pieces', category: 'Main Course', expiryTime: '9:30 PM', image: getFoodImage('Tandoori Chicken') },
  { restaurant: r('Tandoor Junction'), name: 'Chicken Tikka', quantity: '16 pieces', category: 'Main Course', expiryTime: '9:15 PM', image: getFoodImage('Chicken Tikka') },
  { restaurant: r('Tandoor Junction'), name: 'Paneer Tikka', quantity: '12 pieces', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Paneer Tikka') },
  { restaurant: r('Tandoor Junction'), name: 'Seekh Kebab', quantity: '18 pieces', category: 'Main Course', expiryTime: '9:00 PM', image: getFoodImage('Seekh Kebab') },
  
  // Tandoor Junction - Bread
  { restaurant: r('Tandoor Junction'), name: 'Tandoori Roti', quantity: '35 pieces', category: 'Bread', expiryTime: '9:15 PM', image: getFoodImage('Tandoori Roti') },
  { restaurant: r('Tandoor Junction'), name: 'Rumali Roti', quantity: '20 pieces', category: 'Bread', expiryTime: '9:00 PM', image: getFoodImage('Rumali Roti') },
  { restaurant: r('Tandoor Junction'), name: 'Lachha Paratha', quantity: '15 pieces', category: 'Bread', expiryTime: '8:45 PM', image: getFoodImage('Lachha Paratha') },
  
  // Biryani House - Rice
  { restaurant: r('Biryani House'), name: 'Hyderabadi Biryani', quantity: '15 portions', category: 'Rice', expiryTime: '9:30 PM', image: getFoodImage('Hyderabadi Biryani') },
  { restaurant: r('Biryani House'), name: 'Lucknowi Biryani', quantity: '12 portions', category: 'Rice', expiryTime: '9:15 PM', image: getFoodImage('Lucknowi Biryani') },
  { restaurant: r('Biryani House'), name: 'Kolkata Biryani', quantity: '10 portions', category: 'Rice', expiryTime: '9:00 PM', image: getFoodImage('Kolkata Biryani') },
  { restaurant: r('Biryani House'), name: 'Vegetable Biryani', quantity: '18 portions', category: 'Rice', expiryTime: '9:30 PM', image: getFoodImage('Vegetable Biryani') },
  { restaurant: r('Biryani House'), name: 'Egg Biryani', quantity: '14 portions', category: 'Rice', expiryTime: '9:15 PM', image: getFoodImage('Egg Biryani') },
  
  // Biryani House - Side Dish
  { restaurant: r('Biryani House'), name: 'Chicken 65', quantity: '12 portions', category: 'Side Dish', expiryTime: '9:00 PM', image: getFoodImage('Chicken 65') },
  { restaurant: r('Biryani House'), name: 'Mirchi Ka Salan', quantity: '10 portions', category: 'Side Dish', expiryTime: '9:30 PM', image: getFoodImage('Mirchi Ka Salan') },
  
  // Desserts
  { restaurant: r('Spice Garden'), name: 'Gulab Jamun', quantity: '20 pieces', category: 'Dessert', expiryTime: '10:00 PM', image: getFoodImage('Gulab Jamun') },
  { restaurant: r('Curry House'), name: 'Kheer', quantity: '15 portions', category: 'Dessert', expiryTime: '9:45 PM', image: getFoodImage('Kheer') },
  { restaurant: r('Dosa Palace'), name: 'Mysore Pak', quantity: '25 pieces', category: 'Dessert', expiryTime: '10:00 PM', image: getFoodImage('Mysore Pak') },
  { restaurant: r('Street Bites'), name: 'Jalebi', quantity: '30 pieces', category: 'Dessert', expiryTime: '9:30 PM', image: getFoodImage('Jalebi') },
  { restaurant: r('Tandoor Junction'), name: 'Rasgulla', quantity: '18 pieces', category: 'Dessert', expiryTime: '10:00 PM', image: getFoodImage('Rasgulla') },
  { restaurant: r('Biryani House'), name: 'Ice Cream', quantity: '20 portions', category: 'Dessert', expiryTime: '10:30 PM', image: getFoodImage('Ice Cream') },
  
  // Beverages
  { restaurant: r('Spice Garden'), name: 'Lassi', quantity: '25 glasses', category: 'Beverages', expiryTime: '9:00 PM', image: getFoodImage('Lassi') },
  { restaurant: r('Curry House'), name: 'Mango Shake', quantity: '20 glasses', category: 'Beverages', expiryTime: '9:30 PM', image: getFoodImage('Mango Shake') },
  { restaurant: r('Dosa Palace'), name: 'Buttermilk', quantity: '30 glasses', category: 'Beverages', expiryTime: '8:30 PM', image: getFoodImage('Buttermilk') },
  { restaurant: r('Street Bites'), name: 'Lemonade', quantity: '25 glasses', category: 'Beverages', expiryTime: '9:00 PM', image: getFoodImage('Lemonade') },
  { restaurant: r('Tandoor Junction'), name: 'Jal Jeera', quantity: '22 glasses', category: 'Beverages', expiryTime: '9:15 PM', image: getFoodImage('Jal Jeera') },
  { restaurant: r('Biryani House'), name: 'Cold Coffee', quantity: '18 glasses', category: 'Beverages', expiryTime: '9:45 PM', image: getFoodImage('Cold Coffee') }
]);

console.log('Seeded restaurants and menu items');
process.exit(0);


