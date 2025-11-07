import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, Users, Target, Award, TrendingUp } from 'lucide-react';
import '../styles/About.css';

export default function About() {
  const milestones = [
    { year: '2018', event: 'MealConnect Founded', desc: 'Started with 5 volunteers in Bengaluru' },
    { year: '2019', event: '10,000 Meals Served', desc: 'Expanded to 3 cities' },
    { year: '2020', event: 'COVID Relief', desc: 'Served 25,000+ meals during pandemic' },
    { year: '2022', event: '15 Partner NGOs', desc: 'Growing network across India' },
    { year: '2024', event: '50,000+ Meals', desc: 'Active in 25 cities nationwide' },
    { year: '2025', event: '200+ Volunteers', desc: 'Continuing our mission' }
  ];

  const team = [
    { name: 'Asha Verma', role: 'Founder & Director', avatar: '👩‍💼', bio: 'Social entrepreneur passionate about food security' },
    { name: 'Rajesh Kumar', role: 'Operations Head', avatar: '👨‍💼', bio: 'Former restaurant manager, logistics expert' },
    { name: 'Priya Menon', role: 'Volunteer Coordinator', avatar: '👩‍🏫', bio: 'Community organizer with 10 years experience' },
    { name: 'Arjun Patel', role: 'Partnerships Manager', avatar: '👨‍💻', bio: 'Building bridges with restaurants and donors' }
  ];

  const values = [
    { icon: <Heart size={32} />, title: 'Compassion', desc: 'Every meal is prepared with love and care' },
    { icon: <Users size={32} />, title: 'Community', desc: 'Together we can end hunger' },
    { icon: <Target size={32} />, title: 'Impact', desc: 'Measurable change in people\'s lives' },
    { icon: <Award size={32} />, title: 'Excellence', desc: 'Quality food and service always' }
  ];

  const impact = [
    { number: '50,000+', label: 'Meals Served', icon: '🍱' },
    { number: '25', label: 'Cities', icon: '🏙️' },
    { number: '200+', label: 'Volunteers', icon: '🤝' },
    { number: '30+', label: 'Partner Restaurants', icon: '🍽️' },
    { number: '15', label: 'Partner NGOs', icon: '💼' },
    { number: '10K+', label: 'Lives Impacted', icon: '❤️' }
  ];

  return (
    <div className="about-container">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <Link to="/" className="logo-section">
            <div className="logo-icon">🍕</div>
            <span className="logo-text">MealConnect</span>
          </Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/about" className="active">About Us</Link>
            <Link to="/volunteer">Volunteer</Link>
            <Link to="/partners">Partners</Link>
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
      <section className="about-hero">
        <div className="hero-content-wrapper">
          <h1 className="about-hero-title">
            Our <span className="highlight">Mission</span>
          </h1>
          <p className="about-hero-subtitle">
            Connecting communities through food, one meal at a time
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="section-container">
          <div className="story-grid">
            <div className="story-content">
              <h2 className="section-title">Our Story</h2>
              <p className="story-text">
                MealConnect was born in 2018 when our founder, Asha Verma, witnessed the stark contrast between food waste in restaurants and hunger in nearby communities. What started as a weekend initiative with five volunteers has grown into a nationwide movement.
              </p>
              <p className="story-text">
                We partner with local restaurants, community kitchens, and volunteers to ensure nutritious meals reach those who need them most. Our donation-based model allows us to operate sustainably while maintaining our commitment to quality and dignity.
              </p>
              <p className="story-text">
                Today, we're proud to serve thousands of meals every month across 25 cities in India, but our mission is far from complete. Every meal we serve is a step toward a hunger-free nation.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <div className="main-icon">👨‍🍳</div>
                <div className="floating-icon">🍛</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="section-container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-desc">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="section-container">
          <h2 className="section-title">Our Impact</h2>
          <p className="section-subtitle">Numbers that tell our story</p>
          <div className="impact-grid">
            {impact.map((item, index) => (
              <div key={index} className="impact-card">
                <div className="impact-icon">{item.icon}</div>
                <div className="impact-number">{item.number}</div>
                <div className="impact-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="section-container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3 className="timeline-event">{milestone.event}</h3>
                  <p className="timeline-desc">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="section-container">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">The passionate people behind MealConnect</p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">{member.avatar}</div>
                <h3 className="team-name">{member.name}</h3>
                <div className="team-role">{member.role}</div>
                <p className="team-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Join Our Mission</h2>
          <p className="cta-text">
            Whether you want to volunteer, partner with us, or support our cause, there are many ways to get involved.
          </p>
          <div className="cta-buttons">
            <Link to="/volunteer" className="btn-primary">Become a Volunteer</Link>
            <Link to="/donate" className="btn-secondary">Donate Now</Link>
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
                <li><Link to="/donate" className="footer-link">Donate</Link></li>
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
                <li>📧 info@mealconnect.in</li>
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