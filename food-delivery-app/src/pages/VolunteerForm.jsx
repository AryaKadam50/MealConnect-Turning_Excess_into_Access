import React, { useState } from "react";
import { CheckCircle, User, Mail, Clock, Shield, Upload, ArrowRight } from "lucide-react";
import api from '../api';
import '../styles/VolunteerForm.css';

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    availability: "",
    verificationProof: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({
        ...prev,
        verificationProof: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('availability', formData.availability);
      if (formData.verificationProof) {
        payload.append('verificationProof', formData.verificationProof);
      }
      await api.post('/volunteers', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", phone: "", availability: "", verificationProof: "" });
        setFileName("");
      }, 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed. Please try again.');
    }
  };

  return (
    <div className="volunteer-form-container">
      <div className="volunteer-form-wrapper">
        {!submitted ? (
          <>
            <div className="volunteer-form-header">
              <div className="volunteer-form-icon">🤝</div>
              <h2 className="volunteer-form-title">Join Our Mission</h2>
              <p className="volunteer-form-subtitle">
                Become a volunteer and make a difference in your community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="volunteer-form-body">
              <div className="form-group">
                <label className="form-label">
                  <User size={18} className="form-label-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} className="form-label-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="form-label-icon">📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={18} className="form-label-icon" />
                  Availability
                </label>
                <textarea
                  name="availability"
                  placeholder="e.g., Weekends, Evenings (6-9 PM), Flexible"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Shield size={18} className="form-label-icon" />
                  ID Verification Proof
                </label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="fileUpload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    required
                    className="file-upload-input"
                  />
                  <label htmlFor="fileUpload" className="file-upload-label">
                    <Upload size={20} className="file-upload-icon" />
                    <span className="file-upload-text">
                      {fileName || "Upload ID (Aadhaar, PAN, or Driving License)"}
                    </span>
                  </label>
                  {fileName && (
                    <div className="file-selected">
                      ✓ {fileName}
                    </div>
                  )}
                  <p className="file-hint">
                    Accepted formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
              </div>

              <button type="submit" className="submit-button">
                <span>Submit Application</span>
                <ArrowRight size={20} />
              </button>

              <p className="privacy-note">
                Your information is secure and will only be used for volunteer verification purposes.
              </p>
            </form>
          </>
        ) : (
          <div className="success-container">
            <CheckCircle size={80} className="success-icon" strokeWidth={2} />
            <h3 className="success-title">
              Application Submitted! 🎉
            </h3>
            <p className="success-message">
              Thank you, <strong className="success-name">{formData.name}</strong>! We've received your volunteer application.
            </p>
            <p className="success-timeline">
              Our team will review your application and contact you at <strong className="success-email">{formData.email}</strong> within 2-3 business days.
            </p>
            <div className="success-features">
              <div className="success-feature">
                <span className="success-feature-icon">📧</span>
                <span className="success-feature-text">Email Confirmation Sent</span>
              </div>
              <div className="success-feature">
                <span className="success-feature-icon">✅</span>
                <span className="success-feature-text">ID Verified</span>
              </div>
              <div className="success-feature">
                <span className="success-feature-icon">⏰</span>
                <span className="success-feature-text">Response in 2-3 Days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}