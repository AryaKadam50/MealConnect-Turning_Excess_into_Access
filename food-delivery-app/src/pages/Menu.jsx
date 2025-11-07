import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Edit2, Save, X, Package, Clock, MapPin, ShoppingCart, ArrowLeft, ExternalLink, Minus, Star, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Menu.css';
import api from '../api';

export default function RestaurantMenuDashboard() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('ecommerce');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: 'Main Course',
    expiryTime: ''
  });

  const [restaurants, setRestaurants] = useState([]);

  const [allMenuItems, setAllMenuItems] = useState({});

  const categories = ['Main Course', 'Rice', 'Bread', 'Dessert', 'Snacks', 'Beverages', 'Side Dish'];
  
  // Get all items as a flat array for e-commerce view
  const allItemsFlat = useMemo(() => {
    const items = [];
    Object.keys(allMenuItems).forEach(restaurantId => {
      const restaurant = restaurants.find(r => r._id === restaurantId || r.id === restaurantId);
      allMenuItems[restaurantId].forEach(item => {
        items.push({
          ...item,
          restaurant: restaurant || allMenuItems[restaurantId][0]?.restaurant,
          restaurantName: restaurant?.name || 'Unknown',
          restaurantLocation: restaurant?.location || '',
          price: Math.floor(Math.random() * 300) + 50, // Mock price
          rating: (4 + Math.random() * 1).toFixed(1),
          description: `Delicious ${item.name} from ${restaurant?.name || 'our kitchen'}. Fresh and ready to serve.`,
          image: item.image || '' // Include image field
        });
      });
    });
    return items;
  }, [allMenuItems, restaurants]);
  
  // Filter items by category and search query
  const filteredItems = useMemo(() => {
    let filtered = allItemsFlat;
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.restaurantName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [allItemsFlat, selectedCategory, searchQuery]);
  
  // Check if item is in cart and get quantity
  const getCartQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? (cartItem.cartQuantity || 1) : 0;
  };

  useEffect(() => {
    const load = async () => {
      try {
        console.log('Loading restaurants and menu items...');
        const [rRes, itemsRes] = await Promise.all([
          api.get('/restaurants'),
          api.get('/menu-items')
        ]);
        console.log('Restaurants loaded:', rRes.data?.length || 0);
        console.log('Menu items loaded:', itemsRes.data?.length || 0);
        setRestaurants(rRes.data || []);
        const grouped = (itemsRes.data || []).reduce((acc, item) => {
          const rid = item.restaurant?._id || item.restaurant;
          acc[rid] = acc[rid] || [];
          acc[rid].push({
            id: item._id,
            restaurantId: rid,
            name: item.name,
            quantity: item.quantity,
            category: item.category,
            expiryTime: item.expiryTime,
            status: item.status,
            restaurant: item.restaurant,
            image: item.image || '',
            price: Math.floor(Math.random() * 300) + 50, // Mock price for display
            rating: (4 + Math.random() * 1).toFixed(1)
          });
          return acc;
        }, {});
        setAllMenuItems(grouped);
        console.log('Menu items grouped:', Object.keys(grouped).length, 'restaurants');
      } catch (e) {
        console.error('Error loading menu items:', e);
        console.error('Error details:', e.response?.data || e.message);
        alert('Failed to load menu items. Please check if the backend server is running on port 5000.');
      }
    };
    load();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('mealconnect_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage');
      }
    }
  }, []);

  const restaurantsWithLocalIds = useMemo(() => {
    return restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      location: r.location,
      contact: r.contact,
      image: r.image || '🍛'
    }));
  }, [restaurants]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddToCart = (item, restaurant = null) => {
    const restaurantData = restaurant || item.restaurant;
    const existingCartItem = cart.find(c => c.id === item.id);
    
    let newCart;
    if (existingCartItem) {
      // Update quantity if already in cart
      newCart = cart.map(c => 
        c.id === item.id 
          ? { ...c, cartQuantity: (c.cartQuantity || 1) + 1 }
          : c
      );
    } else {
      // Add new item to cart
      const cartItem = {
        ...item,
        restaurantName: restaurantData?.name || item.restaurantName || 'Unknown',
        restaurantLocation: restaurantData?.location || item.restaurantLocation || '',
        restaurant: restaurantData || item.restaurant,
        restaurantId: restaurantData?._id || restaurantData?.id || item.restaurant?._id || item.restaurant?.id || item.restaurantId,
        cartId: Date.now(),
        cartQuantity: 1,
        price: item.price || Math.floor(Math.random() * 300) + 50
      };
      newCart = [...cart, cartItem];
    }
    setCart(newCart);
    // Save to localStorage
    localStorage.setItem('mealconnect_cart', JSON.stringify(newCart));
  };
  
  const handleUpdateQuantity = (itemId, change) => {
    const cartItem = cart.find(item => item.id === itemId);
    if (!cartItem) return;
    
    const newQuantity = (cartItem.cartQuantity || 1) + change;
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItem.cartId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.id === itemId
        ? { ...item, cartQuantity: newQuantity }
        : item
    );
    setCart(newCart);
    localStorage.setItem('mealconnect_cart', JSON.stringify(newCart));
  };

  const handleRemoveFromCart = (cartId) => {
    const newCart = cart.filter(item => item.cartId !== cartId);
    setCart(newCart);
    // Update localStorage
    if (newCart.length > 0) {
      localStorage.setItem('mealconnect_cart', JSON.stringify(newCart));
    } else {
      localStorage.removeItem('mealconnect_cart');
    }
  };

  const handleRequestPickup = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to request pickup');
        return;
      }
      const payload = {
        items: cart.map(c => ({
          menuItem: c.id,
          restaurantName: c.restaurantName,
          restaurantLocation: c.restaurantLocation
        }))
      };
      await api.post('/pickups', payload);
      alert(`Pickup request sent for ${cart.length} items!`);
      setCart([]);
      localStorage.removeItem('mealconnect_cart');
    } catch (e) {
      alert('Failed to request pickup');
    }
  };

  const handleAddItem = () => {
    if (formData.name && formData.quantity && formData.expiryTime && selectedRestaurant) {
      api
        .post('/menu-items', {
          restaurant: selectedRestaurant,
          name: formData.name,
          quantity: formData.quantity,
          category: formData.category,
          expiryTime: formData.expiryTime
        })
        .then(({ data }) => {
          const newItem = {
            id: data._id,
            restaurantId: selectedRestaurant,
            name: data.name,
            quantity: data.quantity,
            category: data.category,
            expiryTime: data.expiryTime,
            status: data.status
          };
          setAllMenuItems({
            ...allMenuItems,
            [selectedRestaurant]: [...(allMenuItems[selectedRestaurant] || []), newItem]
          });
          setFormData({ name: '', quantity: '', category: 'Main Course', expiryTime: '' });
          setIsAdding(false);
        });
    }
  };

  const handleEditItem = (id) => {
    const items = allMenuItems[selectedRestaurant] || [];
    const item = items.find(item => item.id === id);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      category: item.category,
      expiryTime: item.expiryTime
    });
    setEditingId(id);
  };

  const handleSaveEdit = () => {
    const updated = (allMenuItems[selectedRestaurant] || []).find(i => i.id === editingId);
    if (!updated) return;
    api
      .put(`/menu-items/${editingId}`, {
        name: formData.name,
        quantity: formData.quantity,
        category: formData.category,
        expiryTime: formData.expiryTime
      })
      .then(() => {
        setAllMenuItems({
          ...allMenuItems,
          [selectedRestaurant]: (allMenuItems[selectedRestaurant] || []).map(item => 
            item.id === editingId ? { ...item, ...formData } : item
          )
        });
      });
    setEditingId(null);
    setFormData({ name: '', quantity: '', category: 'Main Course', expiryTime: '' });
  };

  const handleDeleteItem = (id) => {
    api.delete(`/menu-items/${id}`).then(() => {
      setAllMenuItems({
        ...allMenuItems,
        [selectedRestaurant]: (allMenuItems[selectedRestaurant] || []).filter(item => item.id !== id)
      });
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: '', quantity: '', category: 'Main Course', expiryTime: '' });
  };

  const renderEcommerceView = () => {
    return (
      <div className="menu-ecommerce-container">
        <div className="menu-header">
          <div className="menu-title-section">
            <h1 className="menu-title">🍽️ Food Menu</h1>
            <p className="menu-subtitle">Browse and order delicious meals from our community kitchens</p>
          </div>
          <Link to="/cart" className="menu-cart-button">
            <ShoppingCart size={24} />
            <span>View Cart</span>
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>
        </div>

        <div className="menu-search-bar">
          <div className="search-input-wrapper">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search for dishes, restaurants, or categories..."
              className="menu-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-button"
                onClick={() => setSearchQuery('')}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="filter-bar">
          <button
            className={`filter-button ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-button ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="empty-menu">
            <div className="empty-menu-icon">🍛</div>
            <h3>No items available</h3>
            <p>Check back later for delicious meals!</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredItems.map(item => {
              const cartQuantity = getCartQuantity(item.id);
              const itemInCart = cartQuantity > 0;
              
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

              return (
                <div key={item.id} className="product-card">
                  <div className="product-image" style={{
                    backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#fef3c7'
                  }}>
                    {!imageUrl && (item.restaurant?.image || '🍛')}
                    <span className="product-badge">{item.category}</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{item.name}</h3>
                    <div className="product-restaurant">
                      <MapPin size={14} />
                      {item.restaurantName}
                    </div>
                    <div className="product-details">
                      <div className="product-detail-item">
                        <Package size={16} />
                        <span>{item.quantity} available</span>
                      </div>
                      <div className="product-detail-item">
                        <Star size={16} style={{ fill: '#fb923c', color: '#fb923c' }} />
                        <span>{item.rating} rating</span>
                      </div>
                      <div className="product-detail-item">
                        <Clock size={16} />
                        <span>Best before: {item.expiryTime || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="product-price-section">
                      <div className="product-price">₹{item.price}</div>
                      {!itemInCart ? (
                        <button
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart size={18} />
                          Add to Cart
                        </button>
                      ) : (
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="quantity-display">{cartQuantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderRestaurantSelection = () => (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                🍽️ NGO Dashboard
              </h1>
              <p style={{ color: '#718096', fontSize: '16px' }}>Choose a restaurant to view available surplus food</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link 
                to="/cart"
                style={{ 
                  background: cart.length > 0 ? '#48bb78' : '#e2e8f0',
                  color: cart.length > 0 ? 'white' : '#718096',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = cart.length > 0 ? '#38a169' : '#cbd5e0'}
                onMouseOut={(e) => e.target.style.background = cart.length > 0 ? '#48bb78' : '#e2e8f0'}
              >
                <ShoppingCart size={20} />
                Cart ({cart.length})
              </Link>
              <button
                onClick={() => setViewMode('restaurant')}
                style={{
                  background: '#667eea',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#5568d3'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                Restaurant View
              </button>
            </div>
          </div>
        </div>

        {cart.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ShoppingCart size={28} color="#48bb78" />
              Your Cart
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {cart.map(item => (
                <div
                  key={item.cartId}
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = '#48bb78'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                      {item.name}
                    </h4>
                    <div style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>
                      <strong>{item.restaurantName}</strong> • {item.restaurantLocation}
                    </div>
                    <div style={{ fontSize: '14px', color: '#718096' }}>
                      {item.quantity} • Best before: {item.expiryTime}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.cartId)}
                    style={{
                      background: '#fed7d7',
                      color: '#e53e3e',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#fc8181'}
                    onMouseOut={(e) => e.target.style.background = '#fed7d7'}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <Link
                to="/cart"
                style={{
                  flex: 1,
                  background: '#667eea',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => e.target.style.background = '#5568d3'}
                onMouseOut={(e) => e.target.style.background = '#667eea'}
              >
                <ExternalLink size={18} />
                View Cart Page
              </Link>
              <button
                style={{
                  flex: 1,
                  background: '#48bb78',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#38a169'}
                onMouseOut={(e) => e.target.style.background = '#48bb78'}
                onClick={handleRequestPickup}
              >
                Request Pickup ({cart.length} items)
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {restaurantsWithLocalIds.map(restaurant => {
            const itemCount = allMenuItems[restaurant.id]?.length || 0;
            return (
              <div
                key={restaurant.id}
                onClick={() => setSelectedRestaurant(restaurant.id)}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '28px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '2px solid transparent'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(102,126,234,0.2)';
                  e.currentTarget.style.borderColor = '#667eea';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ fontSize: '72px', textAlign: 'center', marginBottom: '20px' }}>
                  {restaurant.image}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px', textAlign: 'center' }}>
                  {restaurant.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#718096', fontSize: '14px', marginBottom: '16px', justifyContent: 'center' }}>
                  <MapPin size={16} />
                  <span>{restaurant.location}</span>
                </div>
                <div style={{ 
                  background: itemCount > 0 ? '#c6f6d5' : '#fed7d7',
                  color: itemCount > 0 ? '#22543d' : '#742a2a',
                  padding: '10px 20px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'} Available
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderRestaurantMenu = () => {
    const restaurant = restaurants.find(r => r.id === selectedRestaurant);
    const menuItems = allMenuItems[selectedRestaurant] || [];

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: '#edf2f7',
                  color: '#667eea',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeft size={18} />
                Back to Home
              </button>
              <button
                onClick={() => setSelectedRestaurant(null)}
                style={{
                  background: '#edf2f7',
                  color: '#667eea',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <ArrowLeft size={18} />
                Back to Restaurants
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '56px', marginBottom: '12px' }}>{restaurant.image}</div>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                  {restaurant.name}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#718096', fontSize: '16px' }}>
                  <MapPin size={18} />
                  <span>{restaurant.location}</span>
                </div>
              </div>
              <Link
                to="/cart"
                style={{ 
                  background: cart.length > 0 ? '#48bb78' : '#e2e8f0',
                  color: cart.length > 0 ? 'white' : '#718096',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = cart.length > 0 ? '#38a169' : '#cbd5e0'}
                onMouseOut={(e) => e.target.style.background = cart.length > 0 ? '#48bb78' : '#e2e8f0'}
              >
                <ShoppingCart size={22} />
                Cart ({cart.length})
              </Link>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a202c', marginBottom: '24px' }}>
              🥘 Available Surplus Items
            </h2>

            {menuItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#a0aec0' }}>
                <Package size={72} style={{ margin: '0 auto 24px', opacity: 0.5 }} />
                <p style={{ fontSize: '20px' }}>No items available from this restaurant yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '22px', fontWeight: '600', color: '#1a202c', marginBottom: '12px' }}>
                        {item.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '15px' }}>
                          <Package size={18} />
                          <span>{item.quantity}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '15px' }}>
                          <span>📋</span>
                          <span>{item.category}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#718096', fontSize: '15px' }}>
                          <Clock size={18} />
                          <span>Best before: {item.expiryTime}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item, restaurant)}
                      style={{
                        background: '#48bb78',
                        color: 'white',
                        padding: '14px 28px',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '16px',
                        fontWeight: '600',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#38a169';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#48bb78';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRestaurantView = () => {
    const restaurant = selectedRestaurant ? restaurants.find(r => r.id === selectedRestaurant) : null;
    const menuItems = selectedRestaurant ? (allMenuItems[selectedRestaurant] || []) : [];

    if (!selectedRestaurant) {
      return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                    🍳 Restaurant Dashboard
                  </h1>
                  <p style={{ color: '#718096', fontSize: '16px' }}>Select your restaurant to manage surplus food</p>
                </div>
                <button
                  onClick={() => setViewMode('ngo')}
                  style={{
                    background: '#48bb78',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#38a169'}
                  onMouseOut={(e) => e.target.style.background = '#48bb78'}
                >
                  NGO View
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {restaurants.map(restaurant => (
                <div
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant.id)}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'center'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(102,126,234,0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ fontSize: '72px', marginBottom: '20px' }}>{restaurant.image}</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                    {restaurant.name}
                  </h3>
                  <p style={{ color: '#718096', fontSize: '14px' }}>{restaurant.location}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', marginBottom: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <button
              onClick={() => setSelectedRestaurant(null)}
              style={{
                background: '#edf2f7',
                color: '#667eea',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.target.style.background = '#edf2f7'}
            >
              <ArrowLeft size={18} />
              Back to Restaurant Selection
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
                  Manage Menu - {restaurant.name}
                </h1>
                <p style={{ color: '#718096', fontSize: '16px' }}>Add and manage your surplus food items</p>
              </div>
              <div style={{ background: '#48bb78', color: 'white', padding: '10px 20px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
                ✅ Partner Restaurant
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#edf2f7', padding: '14px', borderRadius: '12px' }}>
                  <Package size={24} color="#667eea" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Restaurant</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>{restaurant.name}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#edf2f7', padding: '14px', borderRadius: '12px' }}>
                  <MapPin size={24} color="#667eea" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Location</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>{restaurant.location}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#edf2f7', padding: '14px', borderRadius: '12px' }}>
                  <Clock size={24} color="#667eea" />
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>Items Listed</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>{menuItems.length} items</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c' }}>Surplus Food Items</h2>
              <button
                onClick={() => setIsAdding(true)}
                style={{
                  background: '#48bb78',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = '#38a169'}
                onMouseOut={(e) => e.target.style.background = '#48bb78'}
              >
                <Plus size={18} />
                Add New Item
              </button>
            </div>

            {(isAdding || editingId) && (
              <div style={{ 
                border: '2px dashed #e2e8f0', 
                borderRadius: '12px', 
                padding: '24px', 
                marginBottom: '24px',
                background: '#f7fafc'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '16px' }}>
                  {editingId ? 'Edit Item' : 'Add New Item'}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>
                      Item Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter item name"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>
                      Quantity
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 portions"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '6px' }}>
                      Expiry Time
                    </label>
                    <input
                      type="text"
                      name="expiryTime"
                      value={formData.expiryTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 8:00 PM"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={editingId ? handleSaveEdit : handleAddItem}
                    style={{
                      background: '#48bb78',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#38a169'}
                    onMouseOut={(e) => e.target.style.background = '#48bb78'}
                  >
                    <Save size={16} />
                    {editingId ? 'Save Changes' : 'Add Item'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    style={{
                      background: '#e2e8f0',
                      color: '#4a5568',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#cbd5e0'}
                    onMouseOut={(e) => e.target.style.background = '#e2e8f0'}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {menuItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px', color: '#a0aec0' }}>
                <Package size={72} style={{ margin: '0 auto 24px', opacity: 0.5 }} />
                <p style={{ fontSize: '18px', marginBottom: '16px' }}>No items added yet</p>
                <p style={{ fontSize: '14px' }}>Click "Add New Item" to list your surplus food</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                        {item.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#718096', fontSize: '14px' }}>
                          <Package size={16} />
                          <span>{item.quantity}</span>
                        </div>
                        <div style={{ color: '#718096', fontSize: '14px' }}>
                          📋 {item.category}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#718096', fontSize: '14px' }}>
                          <Clock size={16} />
                          <span>Best before: {item.expiryTime}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditItem(item.id)}
                        style={{
                          background: '#edf2f7',
                          color: '#667eea',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                        onMouseOut={(e) => e.target.style.background = '#edf2f7'}
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          background: '#fed7d7',
                          color: '#e53e3e',
                          padding: '10px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          transition: 'all 0.3s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#fc8181'}
                        onMouseOut={(e) => e.target.style.background = '#fed7d7'}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === 'ecommerce') {
    return renderEcommerceView();
  }

  if (viewMode === 'restaurant') {
    return renderRestaurantView();
  }

  if (selectedRestaurant) {
    return renderRestaurantMenu();
  }

  return renderRestaurantSelection();
}