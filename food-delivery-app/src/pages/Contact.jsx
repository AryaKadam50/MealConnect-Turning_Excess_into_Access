import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="contact-content">
        <div className="contact-info-section">
          <div className="info-card">
            <div className="info-icon">
              <MapPin size={24} />
            </div>
            <h3>Address</h3>
            <p>12 NGO Lane, Food Park</p>
            <p>Bengaluru, Karnataka — 560001</p>
            <p>India</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Phone size={24} />
            </div>
            <h3>Phone</h3>
            <p>+91 98765 43210</p>
            <p>WhatsApp Available</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Mail size={24} />
            </div>
            <h3>Email</h3>
            <p>info@mealconnect.in</p>
            <p>support@mealconnect.in</p>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Clock size={24} />
            </div>
            <h3>Office Hours</h3>
            <p>Monday - Friday</p>
            <p>08:00 - 20:00</p>
            <p>Saturday - Sunday</p>
            <p>08:00 - 18:00</p>
          </div>
        </div>

        <div className="contact-form-section">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows="6"
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                <Send size={20} />
                Send Message
              </button>
            </form>
          ) : (
            <div className="success-message">
              <CheckCircle size={64} className="success-icon-large" />
              <h2>Message Sent!</h2>
              <p>Thank you, <strong>{formData.name}</strong>! We've received your message and will get back to you soon.</p>
            </div>
          )}
        </div>
      </div>

      <div className="contact-map-section">
        <h2 className="map-title">Find Us</h2>
        <div className="map-container">
          <iframe
            title="MealConnect Location"
            src="https://www.google.com/maps?q=Bengaluru+Karnataka+India&output=embed"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

