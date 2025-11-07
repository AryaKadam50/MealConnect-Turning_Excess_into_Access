import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Heart, CreditCard, Smartphone, Building2, CheckCircle, DollarSign } from 'lucide-react';
import '../styles/Donate.css';

export default function Donate() {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    panCard: ''
  });
  const [donated, setDonated] = useState(false);

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setSelectedAmount('');
  };

  const handleDonorInfoChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDonate = (e) => {
    e.preventDefault();
    const amount = selectedAmount || customAmount;
    console.log('Donation:', {
      amount,
      paymentMethod,
      donorInfo
    });
    setDonated(true);
    setTimeout(() => {
      setDonated(false);
      setSelectedAmount('');
      setCustomAmount('');
      setDonorInfo({ name: '', email: '', phone: '', panCard: '' });
    }, 3000);
  };

  const impactData = [
    { amount: '₹500', impact: 'Feed 10 people for a day', icon: '🍱' },
    { amount: '₹1000', impact: 'Provide medical aid to 3 patients', icon: '💊' },
    { amount: '₹2500', impact: 'Support education for a child for a month', icon: '📚' },
    { amount: '₹5000', impact: 'Help fund temple maintenance and cleanliness', icon: '🛕' },
    { amount: '₹10000', impact: 'Sponsor a community meal event', icon: '🙏' }
  ];

  return (
    <div className="donate-container">
      <h2 className="donate-title">🙏 Make a Donation 🙏</h2>
      <p className="donate-subtitle">Your contribution brings light, health, and hope to many.</p>

      <div className="impact-section">
        {impactData.map((item, index) => (
          <div key={index} className="impact-card">
            <span className="impact-icon">{item.icon}</span>
            <h4>{item.amount}</h4>
            <p>{item.impact}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleDonate} className="donate-form">
        <h3>Select Donation Amount</h3>
        <div className="amount-buttons">
          {predefinedAmounts.map((amt) => (
            <button
              type="button"
              key={amt}
              className={selectedAmount === amt ? 'active' : ''}
              onClick={() => handleAmountSelect(amt)}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Enter custom amount"
          value={customAmount}
          onChange={handleCustomAmount}
          className="custom-amount-input"
        />

        <h3>Payment Method</h3>
        <div className="payment-options">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Smartphone size={18} /> UPI
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <CreditCard size={18} /> Card
          </label>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === 'bank'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Building2 size={18} /> Bank Transfer
          </label>
        </div>

        <h3>Donor Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={donorInfo.name}
          onChange={handleDonorInfoChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={donorInfo.email}
          onChange={handleDonorInfoChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={donorInfo.phone}
          onChange={handleDonorInfoChange}
          required
        />
        <input
          type="text"
          name="panCard"
          placeholder="PAN Card (optional)"
          value={donorInfo.panCard}
          onChange={handleDonorInfoChange}
        />

        <button type="submit" className="donate-btn">
          <Heart size={18} /> Donate Now
        </button>
      </form>

      {donated && (
        <div className="donation-success">
          <CheckCircle size={40} color="green" />
          <p>Thank you for your generous donation! 💖</p>
        </div>
      )}
    </div>
  );
}
