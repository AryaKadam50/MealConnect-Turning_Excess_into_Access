import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Package, MapPin, Clock, ArrowLeft, CheckCircle, Plus, Minus, Star, CreditCard, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/Cart.css';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [requested, setRequested] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('mealconnect_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (cartItems.length > 0) {
      localStorage.setItem('mealconnect_cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('mealconnect_cart');
    }
  }, [cartItems]);

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.cartId !== itemId));
  };

  const handleUpdateQuantity = (itemId, change) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    if (!cartItem) return;
    
    const newQuantity = (cartItem.cartQuantity || 1) + change;
    if (newQuantity <= 0) {
      handleRemoveItem(cartItem.cartId);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === itemId
        ? { ...item, cartQuantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.cartQuantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 100;
      const quantity = item.cartQuantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const handleProceedToPayment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to proceed with payment');
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentComplete = async () => {
    try {
      setIsLoading(true);
      
      // Group items by restaurant to ensure proper tracking
      const items = cartItems.map(c => ({
        menuItem: c.id,
        restaurant: c.restaurantId || c.restaurant?._id || c.restaurant, // Support different formats
        restaurantName: c.restaurantName,
        restaurantLocation: c.restaurantLocation,
        quantity: c.cartQuantity || 1,
        itemName: c.name,
        itemPrice: c.price || 100
      }));

      const payload = {
        items,
        paymentMethod,
        totalAmount: getTotalPrice()
      };

      await api.post('/pickups', payload);
      setRequested(true);
      setCartItems([]);
      localStorage.removeItem('mealconnect_cart');
      
      setTimeout(() => {
        setRequested(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      alert('Failed to request pickup. Please try again.');
      console.error('Pickup request error:', error);
      setShowPayment(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (requested) {
    return (
      <div className="cart-container">
        <div className="cart-success">
          <CheckCircle size={80} className="success-icon" />
          <h2>Pickup Request Sent! 🎉</h2>
          <p>Thank you for your request. We'll contact you soon to arrange the pickup.</p>
          <Link to="/" className="back-home-button">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        <div className="cart-title-section">
          <ShoppingCart size={32} className="cart-icon" />
          <h1 className="cart-title">Your Cart</h1>
        </div>
        {cartItems.length > 0 && (
          <p className="cart-subtitle">{getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''} in your cart</p>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={80} className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Add some items from the menu to get started!</p>
          <Link to="/menu" className="browse-menu-button">
            Browse Menu
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items-section">
            {cartItems.map((item) => {
              // Helper to get full image URL
              const getImageUrl = (image) => {
                if (!image) return null;
                if (image.startsWith('http://') || image.startsWith('https://')) {
                  return image; // Absolute URL
                }
                // Relative path - prepend backend URL
                const backendUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || '';
                return `${backendUrl}${image}`;
              };

              const imageUrl = getImageUrl(item.image);
              const quantity = item.cartQuantity || 1;
              const itemPrice = item.price || 100;
              const totalPrice = itemPrice * quantity;

              return (
                <div key={item.cartId} className="cart-item">
                  <div 
                    className="cart-item-image"
                    style={{
                      backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#fef3c7',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: imageUrl ? '1rem' : '4rem',
                      overflow: 'hidden'
                    }}
                  >
                    {!imageUrl && (item.restaurant?.image || '🍛')}
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    {item.restaurantName && (
                      <div className="cart-item-restaurant">
                        <MapPin size={16} />
                        <span>{item.restaurantName}{item.restaurantLocation && ` • ${item.restaurantLocation}`}</span>
                      </div>
                    )}
                    <div className="cart-item-info">
                      <div className="cart-item-info-item">
                        <Package size={16} />
                        <span>{item.quantity} available</span>
                      </div>
                      {item.category && (
                        <div className="cart-item-info-item">
                          <span>📋</span>
                          <span>{item.category}</span>
                        </div>
                      )}
                      <div className="cart-item-info-item">
                        <Clock size={16} />
                        <span>Best before: {item.expiryTime || 'N/A'}</span>
                      </div>
                      {item.rating && (
                        <div className="cart-item-info-item">
                          <Star size={16} style={{ fill: '#fb923c', color: '#fb923c' }} />
                          <span>{item.rating} rating</span>
                        </div>
                      )}
                    </div>
                    {item.price && (
                      <div className="cart-item-price">
                        ₹{itemPrice} {quantity > 1 && `× ${quantity} = ₹${totalPrice}`}
                      </div>
                    )}
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-quantity-controls">
                      <button
                        className="cart-quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="cart-quantity-display">{quantity}</span>
                      <button
                        className="cart-quantity-btn"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.cartId)}
                      className="remove-button"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-footer">
          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Items:</span>
              <strong>{getTotalItems()}</strong>
            </div>
            {getTotalPrice() > 0 && (
              <div className="summary-row">
                <span>Total Price:</span>
                <strong>₹{getTotalPrice()}</strong>
              </div>
            )}
          </div>
          
          {!showPayment ? (
            <button
              onClick={handleProceedToPayment}
              className="request-pickup-button"
              disabled={isLoading}
            >
              <CreditCard size={20} />
              Proceed to Payment
            </button>
          ) : (
            <div className="payment-section">
              <div className="payment-header">
                <Lock size={18} />
                <span>Secure Payment</span>
              </div>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Online Payment (UPI/Card)</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
              <div className="payment-actions">
                <button
                  onClick={handlePaymentComplete}
                  className="request-pickup-button"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Complete Payment & Request Pickup'}
                </button>
                <button
                  onClick={() => setShowPayment(false)}
                  className="btn-cancel-payment"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          </div>
        </>
      )}
    </div>
  );
}

