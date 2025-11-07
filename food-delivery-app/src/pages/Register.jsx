import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/Auth.css';
import AddressComponent from '../components/AddressComponent.jsx';

function Register() {
  const navigate = useNavigate();
  const { register: registerUser, user } = useAuth();

  useEffect(() => {
    // Redirect if already logged in - go back to home
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });

  // flat address fields to collect via AddressComponent
  useEffect(() => {
    setFormData((f) => ({
      ...f,
      addressLine: f.addressLine || '',
      addressCity: f.addressCity || '',
      addressState: f.addressState || '',
      addressPincode: f.addressPincode || '',
      addressCountry: f.addressCountry || ''
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      // compose address if provided
      const address = {
        line: formData.addressLine || '',
        city: formData.addressCity || '',
        state: formData.addressState || '',
        pincode: formData.addressPincode || '',
        country: formData.addressCountry || ''
      };

      const data = await registerUser(formData.name, formData.email, formData.password, formData.role, address);
      // Only redirect to dashboards for admin/restaurant, regular users go to home
      if (data?.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (data?.role === 'restaurant') {
        navigate('/restaurant-dashboard');
      } else {
        // Regular users go to home page (same dashboard)
        navigate('/');
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="auth-select"
            required
          >
            <option value="user">Regular User</option>
            <option value="restaurant">Restaurant</option>
            <option value="ngo">NGO</option>
            <option value="admin">Admin</option>
          </select>
          <small style={{ color: '#718096', fontSize: '12px', marginTop: '4px', display: 'block' }}>
            Note: Admin role gives full access to manage the platform
          </small>
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#4a5568', fontWeight: 600 }}>Address</label>
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
        <button type="submit" className="btn-primary">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      
      <p style={{ marginTop: '1rem' }}>
        <Link to="/" style={{ color: '#f97316', textDecoration: 'none', fontWeight: 500 }}>
          ← Back to Home
        </Link>
      </p>
    </div>
  );
}

export default Register;