import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FoodDeliveryUI from './pages/FoodDeliveryUI';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerForm from './pages/VolunteerForm';
import Donate from './pages/Donate';
import About from './pages/About';
import Partners from './pages/Partners';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Search from './pages/Search';
import Cart from './pages/Cart';
import RestaurantDashboard from './pages/RestaurantDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FoodDeliveryUI />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/volunteer" element={<VolunteerForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;