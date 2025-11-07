import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  User, Mail, Edit2, Save, X, Lock, ShoppingBag, Package,
  Store, IndianRupeeIcon, Clock, CheckCircle, XCircle, LogOut,
  MapPin, Phone, TrendingUp,
  IndianRupee
} from 'lucide-react';
import api from '../api';
import '../styles/Profile.css';
import AddressComponent from '../components/AddressComponent.jsx';

export default function Profile() {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [editing, setEditing] = useState(false);
  const [passwordEditing, setPasswordEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // flat address fields used by AddressComponent
    addressLine: '',
    addressCity: '',
    addressState: '',
    addressPincode: '',
    addressCountry: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!authUser) {
      navigate('/login');
      return;
    }
    loadProfileData();
  }, [authUser, navigate]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, ordersRes] = await Promise.all([
        api.get('/user/profile'),
        api.get('/user/stats'),
        api.get('/user/orders')
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
      setFormData({
        name: profileRes.data.name || '',
        email: profileRes.data.email || '',
        addressLine: profileRes.data.address?.line || '',
        addressCity: profileRes.data.address?.city || '',
        addressState: profileRes.data.address?.state || '',
        addressPincode: profileRes.data.address?.pincode || '',
        addressCountry: profileRes.data.address?.country || ''
      });

      // Load restaurant if user is restaurant/ngo
      if (profileRes.data.role === 'restaurant' || profileRes.data.role === 'ngo') {
        try {
          const restaurantRes = await api.get('/user/restaurant');
          setRestaurant(restaurantRes.data);
        } catch (error) {
          // Restaurant not found, that's okay
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // compose address object for backend
      const payload = {
        name: formData.name,
        email: formData.email,
        address: {
          line: formData.addressLine,
          city: formData.addressCity,
          state: formData.addressState,
          pincode: formData.addressPincode,
          country: formData.addressCountry
        }
      };

      const res = await api.put('/user/profile', payload);
      setProfile(res.data);
      setEditing(false);
      alert('Profile updated successfully');
      // Update auth context
      window.location.reload(); // Simple way to refresh user data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    try {
      await api.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordEditing(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password updated successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update password');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: '#fef3c7', color: '#92400e', icon: Clock },
      accepted: { bg: '#dbeafe', color: '#1e40af', icon: CheckCircle },
      completed: { bg: '#d1fae5', color: '#065f46', icon: CheckCircle },
      rejected: { bg: '#fee2e2', color: '#991b1b', icon: XCircle },
      cancelled: { bg: '#fee2e2', color: '#991b1b', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className="status-badge"
        style={{ background: config.bg, color: config.color }}
      >
        <Icon size={14} />
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Information */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="btn-edit">
                <Edit2 size={18} />
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label>
                  <User size={18} />
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <AddressComponent
                  editing={true}
                  address={{
                    line: formData.addressLine,
                    city: formData.addressCity,
                    state: formData.addressState,
                    pincode: formData.addressPincode,
                    country: formData.addressCountry
                  }}
                  onChange={(key, value) => setFormData({ ...formData, [key]: value })}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile.name || '',
                      email: profile.email || ''
                    });
                  }}
                  className="btn-cancel"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <User size={20} />
                <div>
                  <label>Name</label>
                  <p>{profile?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="info-item">
                <Mail size={20} />
                <div>
                  <label>Email</label>
                  <p>{profile?.email || 'N/A'}</p>
                </div>
              </div>
              <div className="info-item">
                <Package size={20} />
                <div>
                  <label>Role</label>
                  <p className="role-badge">{profile?.role || 'user'}</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <label>Address</label>
                  <p>
                    {profile?.address ? (
                      `${profile.address.line || ''}${profile.address.city ? ', ' + profile.address.city : ''}${profile.address.state ? ', ' + profile.address.state : ''}${profile.address.pincode ? ' - ' + profile.address.pincode : ''}${profile.address.country ? ', ' + profile.address.country : ''}`
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} />
                <div>
                  <label>Member Since</label>
                  <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="profile-section">
          <div className="section-header">
            <h2>Change Password</h2>
            {!passwordEditing && (
              <button onClick={() => setPasswordEditing(true)} className="btn-edit">
                <Lock size={18} />
                Change Password
              </button>
            )}
          </div>

          {passwordEditing ? (
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <Lock size={18} />
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>
                  <Lock size={18} />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  <Save size={18} />
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordEditing(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="btn-cancel"
                >
                  <X size={18} />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="info-text">Click "Change Password" to update your password</p>
          )}
        </div>

        {/* Statistics */}
        {stats && (
          <div className="profile-section">
            <h2>Your Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <ShoppingBag size={24} />
                <div>
                  <h3>{stats.orders.total}</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <CheckCircle size={24} />
                <div>
                  <h3>{stats.orders.completed}</h3>
                  <p>Completed</p>
                </div>
              </div>
              <div className="stat-card">
                <Clock size={24} />
                <div>
                  <h3>{stats.orders.pending}</h3>
                  <p>Pending</p>
                </div>
              </div>
              <div className="stat-card">
                <IndianRupee size={24} />
                <div>
                  <h3>₹{stats.totalSpent.toLocaleString()}</h3>
                  <p>Total Spent</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Info (if restaurant/ngo) */}
        {restaurant && (
          <div className="profile-section">
            <h2>Your Restaurant</h2>
            <div className="restaurant-info">
              <div className="info-item">
                <Store size={20} />
                <div>
                  <label>Restaurant Name</label>
                  <p>{restaurant.restaurant.name}</p>
                </div>
              </div>
              <div className="info-item">
                <MapPin size={20} />
                <div>
                  <label>Location</label>
                  <p>{restaurant.restaurant.location}</p>
                </div>
              </div>
              {restaurant.restaurant.contact && (
                <div className="info-item">
                  <Phone size={20} />
                  <div>
                    <label>Contact</label>
                    <p>{restaurant.restaurant.contact}</p>
                  </div>
                </div>
              )}
              <div className="restaurant-stats">
                <div className="stat-item">
                  <Package size={20} />
                  <span>{restaurant.stats.menuItems} Menu Items</span>
                </div>
                <div className="stat-item">
                  <ShoppingBag size={20} />
                  <span>{restaurant.stats.totalPickups} Total Pickups</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/restaurant-dashboard')}
                className="btn-primary"
              >
                Go to Restaurant Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Orders History */}
        <div className="profile-section">
          <h2>Order History</h2>
          {orders.length === 0 ? (
            <p className="empty-message">No orders yet. Start ordering from the menu!</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <p className="order-id">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.itemName || item.menuItem?.name} × {item.quantity}</span>
                        <span>₹{(item.itemPrice || 0) * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <div className="order-total">
                      <strong>Total: ₹{order.totalAmount || 0}</strong>
                    </div>
                    <div className="order-payment">
                      <span className="payment-badge">
                        {order.paymentStatus} ({order.paymentMethod || 'N/A'})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


