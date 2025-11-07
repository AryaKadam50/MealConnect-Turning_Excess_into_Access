import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, MapPin, Phone, Mail, CheckCircle, Building, Utensils } from 'lucide-react';
import api from '../api';
import '../styles/Partners.css';

export default function Partners() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    city: '',
    address: '',
    partnershipType: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/partnerships', formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          businessName: '',
          contactPerson: '',
          email: '',
          phone: '',
          businessType: '',
          city: '',
          address: '',
          partnershipType: '',
          message: ''
        });
      }, 5000);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit partnership application. Please try again.');
    }
  };

  const partnerRestaurants = [
    { name: 'Spice Garden', location: 'Bengaluru', cuisine: 'South Indian', logo: '🌶️' },
    { name: 'Curry House', location: 'Mumbai', cuisine: 'North Indian', logo: '🍛' },
    { name: 'Tandoor Express', location: 'Delhi', cuisine: 'Punjabi', logo: '🔥' },
    { name: 'Dosa Palace', location: 'Chennai', cuisine: 'South Indian', logo: '🥞' },
    { name: 'Street Bites', location: 'Pune', cuisine: 'Street Food', logo: '🌮' },
    { name: 'Royal Biryani', location: 'Hyderabad', cuisine: 'Biryani', logo: '👑' },
    { name: 'Masala Magic', location: 'Kolkata', cuisine: 'Bengali', logo: '✨' },
    { name: 'Chai & Snacks', location: 'Ahmedabad', cuisine: 'Cafe', logo: '☕' }
  ];

  const partnerNGOs = [
    { name: 'Helping Hands India', focus: 'Child Welfare', logo: '🤲' },
    { name: 'Food For All', focus: 'Hunger Relief', logo: '🍚' },
    { name: 'Community Kitchen Trust', focus: 'Community Meals', logo: '🏘️' },
    { name: 'Hope Foundation', focus: 'Urban Poor', logo: '💚' }
  ];

  const benefits = [
    { 
      icon: <Building size={32} />, 
      title: 'Brand Visibility', 
      desc: 'Get featured on our website and social media platforms' 
    },
    { 
      icon: <Utensils size={32} />, 
      title: 'Reduce Food Waste', 
      desc: 'Convert surplus food into meaningful contributions' 
    },
    { 
      icon: <CheckCircle size={32} />, 
      title: 'CSR Compliance', 
      desc: 'Meet your corporate social responsibility goals' 
    },
    { 
      icon: <Phone size={32} />, 
      title: 'Easy Coordination', 
      desc: 'Our team handles all logistics and documentation' 
    }
  ];

  const partnershipTypes = [
    {
      type: 'Food Partner',
      icon: '🍽️',
      desc: 'Restaurants & caterers providing meals or ingredients',
      benefits: ['Tax benefits', 'Brand promotion', 'CSR fulfillment']
    },
    {
      type: 'Logistics Partner',
      icon: '🚚',
      desc: 'Transport & delivery service providers',
      benefits: ['Community impact', 'Marketing exposure', 'Network building']
    },
    {
      type: 'NGO Partner',
      icon: '🤝',
      desc: 'Organizations working in social welfare',
      benefits: ['Resource sharing', 'Joint programs', 'Wider reach']
    },
    {
      type: 'Corporate Sponsor',
      icon: '💼',
      desc: 'Companies supporting our mission financially',
      benefits: ['Tax deductions', 'Employee engagement', 'Social impact']
    }
  ];

  return (
    <div className="partners-container">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo-section">
            <div className="logo-icon">🍕</div>
            <span className="logo-text">MealConnect</span>
          </Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/volunteer">Volunteer</Link>
            <Link to="/partners" className="active">Partners</Link>
            <Link to="/donate">Donate</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-icons">
            <Search className="icon-button" size={20} />
            <ShoppingCart className="icon-button" size={20} />
            <Link to="/login" className="icon-button">
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="partners-hero">
        <div className="hero-content-wrapper">
          <h1 className="partners-hero-title">
            Partner With <span className="highlight">Us</span>
          </h1>
          <p className="partners-hero-subtitle">
            Join our network of restaurants, NGOs, and businesses making a difference
          </p>
        </div>
      </section>

      {/* Partnership Types Section */}
      <section className="partnership-types-section">
        <div className="section-container">
          <h2 className="section-title">Partnership Opportunities</h2>
          <div className="partnership-types-grid">
            {partnershipTypes.map((partnership, index) => (
              <div key={index} className="partnership-type-card">
                <div className="partnership-icon">{partnership.icon}</div>
                <h3 className="partnership-type-title">{partnership.type}</h3>
                <p className="partnership-desc">{partnership.desc}</p>
                <div className="partnership-benefits">
                  <h4>Benefits:</h4>
                  <ul>
                    {partnership.benefits.map((benefit, idx) => (
                      <li key={idx}>
                        <CheckCircle size={16} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <h2 className="section-title">Why Partner With MealConnect?</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-desc">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners Section */}
      <section className="current-partners-section">
        <div className="section-container">
          <h2 className="section-title">Our Restaurant Partners</h2>
          <p className="section-subtitle">Trusted restaurants contributing to our mission</p>
          <div className="partners-grid">
            {partnerRestaurants.map((partner, index) => (
              <div key={index} className="partner-card">
                <div className="partner-logo">{partner.logo}</div>
                <h3 className="partner-name">{partner.name}</h3>
                <div className="partner-meta">
                  <span className="partner-location">
                    <MapPin size={14} />
                    {partner.location}
                  </span>
                  <span className="partner-cuisine">{partner.cuisine}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NGO Partners Section */}
      <section className="ngo-partners-section">
        <div className="section-container">
          <h2 className="section-title">Our NGO Partners</h2>
          <p className="section-subtitle">Collaborating organizations amplifying our impact</p>
          <div className="ngo-grid">
            {partnerNGOs.map((ngo, index) => (
              <div key={index} className="ngo-card">
                <div className="ngo-logo">{ngo.logo}</div>
                <h3 className="ngo-name">{ngo.name}</h3>
                <p className="ngo-focus">{ngo.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section className="partnership-form-section">
        <div className="section-container">
          <div className="form-header">
            <h2 className="section-title">Become a Partner</h2>
            <p className="section-subtitle">Fill out the form and we'll get in touch with you</p>
          </div>

          <div className="form-wrapper">
            <form onSubmit={handleSubmit} className="partnership-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessName">Business/Organization Name *</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="Enter business name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contactPerson">Contact Person *</label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="businessType">Business Type *</label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="catering">Catering Service</option>
                    <option value="ngo">NGO</option>
                    <option value="logistics">Logistics Company</option>
                    <option value="corporate">Corporate</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select City</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="chennai">Chennai</option>
                    <option value="kolkata">Kolkata</option>
                    <option value="hyderabad">Hyderabad</option>
                    <option value="pune">Pune</option>
                    <option value="ahmedabad">Ahmedabad</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="partnershipType">Partnership Interest *</label>
                <select
                  id="partnershipType"
                  name="partnershipType"
                  value={formData.partnershipType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Partnership Type</option>
                  <option value="food">Food Partner</option>
                  <option value="logistics">Logistics Partner</option>
                  <option value="ngo">NGO Collaboration</option>
                  <option value="sponsor">Corporate Sponsor</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your business address"
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Tell us more about your interest *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="What would you like to contribute? How can we collaborate?"
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-primary btn-submit">
                {submitted ? (
                  <>
                    <CheckCircle size={20} />
                    Application Submitted!
                  </>
                ) : (
                  'Submit Partnership Request'
                )}
              </button>

              {submitted && (
                <div className="success-message">
                  Thank you! Our partnerships team will contact you within 48 hours.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <div className="logo-section">
                <div className="logo-icon">🍕</div>
                <span className="logo-text">MealConnect</span>
              </div>
              <p className="footer-brand">Non-profit serving communities across India.</p>
            </div>

            <div>
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About</Link></li>
                <li><Link to="/volunteer" className="footer-link">Volunteer</Link></li>
                <li><Link to="/partners" className="footer-link">Partners</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title">Support</h3>
              <ul className="footer-links">
                <li><a href="#help" className="footer-link">Help Center</a></li>
                <li><a href="#safety" className="footer-link">Safety</a></li>
                <li><a href="#privacy" className="footer-link">Privacy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="footer-title">Contact</h3>
              <ul className="footer-links">
                <li>📧 partnerships@mealconnect.in</li>
                <li>📱 +91 98765 43210</li>
                <li>📍 Bengaluru, Karnataka</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2025 MealConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}