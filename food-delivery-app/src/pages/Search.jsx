import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Star, Package, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import '../styles/Search.css';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        const { data } = await api.get('/menu-items');
        setAllItems(data);
      } catch (error) {
        console.error('Failed to load menu items:', error);
      }
    };
    loadMenuItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      const filtered = allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.restaurant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allItems]);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1 className="search-title">Search Menu Items</h1>
        <p className="search-subtitle">Find food items by name, category, or restaurant</p>
      </div>

      <div className="search-input-wrapper">
        <SearchIcon className="search-input-icon" size={24} />
        <input
          type="text"
          className="search-input"
          placeholder="Search for dishes, categories, or restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
        />
        {searchQuery && (
          <button onClick={handleClear} className="clear-button">
            <X size={20} />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="loading-message">Searching...</div>
      )}

      {!isLoading && searchQuery && searchResults.length === 0 && (
        <div className="no-results">
          <Package size={64} className="no-results-icon" />
          <h3>No results found</h3>
          <p>Try searching with different keywords</p>
        </div>
      )}

      {!isLoading && !searchQuery && (
        <div className="empty-state">
          <SearchIcon size={64} className="empty-state-icon" />
          <h3>Start searching</h3>
          <p>Enter a search query above to find food items</p>
        </div>
      )}

      {!isLoading && searchResults.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2>Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</h2>
          </div>
          <div className="results-grid">
            {searchResults.map((item) => (
              <div key={item._id} className="result-card">
                <div className="result-image">{item.restaurant?.image || '🍛'}</div>
                <div className="result-content">
                  <h3 className="result-name">{item.name}</h3>
                  <div className="result-details">
                    <div className="result-detail-item">
                      <Package size={16} />
                      <span>{item.quantity}</span>
                    </div>
                    <div className="result-detail-item">
                      <span>📋</span>
                      <span>{item.category}</span>
                    </div>
                    <div className="result-detail-item">
                      <Clock size={16} />
                      <span>Best before: {item.expiryTime}</span>
                    </div>
                  </div>
                  {item.restaurant && (
                    <div className="result-restaurant">
                      <MapPin size={16} />
                      <span>{item.restaurant.name} • {item.restaurant.location}</span>
                    </div>
                  )}
                  <div className="result-rating">
                    <Star size={16} className="star-icon" />
                    <span>{(4 + Math.random() * 1).toFixed(1)}</span>
                  </div>
                </div>
                <Link to="/menu" className="view-button">
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

