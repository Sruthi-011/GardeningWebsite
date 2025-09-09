import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo / Brand */}
      <h2 style={{ margin: 0, fontSize: '1.8rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        🌱 My Gardening Website
      </h2>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          display: 'none',
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          color: 'white',
          cursor: 'pointer'
        }}
        className="mobile-menu-button"
      >
        ☰
      </button>

      {/* Menu Links */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
      }} className={isMobileMenuOpen ? 'mobile-menu-open' : ''}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/products" style={linkStyle}>Products</Link>
        <Link to="/cart" style={linkStyle}>Cart</Link>
        <Link to="/visit-booking" style={linkStyle}>Visit Booking</Link>
        <Link to="/plant-sharing" style={linkStyle}>Plant Sharing</Link>
        {token && <Link to="/share-plant" style={linkStyle}>Share a Plant</Link>}
        {token && <Link to="/orders" style={linkStyle}>Orders</Link>}

        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={linkStyle}>Profile</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </>
        )}
      </div>

      {/* Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .mobile-menu-button {
              display: block;
            }
            .mobile-menu-open {
              display: flex;
              flex-direction: column;
              width: 100%;
              margin-top: 10px;
            }
          }
          a:hover {
            color: #ffe066;
            transition: color 0.3s;
          }
          button:hover {
            opacity: 0.8;
            transition: opacity 0.3s;
          }
        `}
      </style>
    </nav>
  );
};

// Common link style
const linkStyle = {
  margin: '5px 10px',
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '1rem',
  cursor: 'pointer',
};

// Logout button style
const logoutButtonStyle = {
  margin: '5px 10px',
  color: 'white',
  background: 'transparent',
  border: '1px solid white',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '500'
};

export default Navbar;
