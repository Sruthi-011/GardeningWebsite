import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully!');
    window.location.href = '/';
  };

  if (!user) return <p style={loadingStyle}>Loading profile...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>👤 My Profile</h2>
      <div style={cardStyle}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Joined On:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
      </div>

      {/* Responsive & hover effects */}
      <style>
        {`
          @media (max-width: 768px) {
            div {
              padding: 15px;
            }
          }

          button:hover {
            background-color: #45a049;
            transform: scale(1.05);
            transition: all 0.3s ease;
          }

          div[style*="border: 1px solid"]:hover {
            transform: scale(1.02);
            transition: all 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  backgroundImage: 'url("http://localhost:5001/uploads/Profile.jpg")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: '70% center',
  backgroundSize: 'contain',
  padding: '30px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const titleStyle = {
  marginBottom: '25px',
  color: '#4CAF50',
  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
};

const loadingStyle = {
  fontSize: '18px',
  color: '#4CAF50',
  marginTop: '30px',
  textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
};

const cardStyle = {
  maxWidth: '400px',
  margin: '20px auto',
  padding: '25px',
  border: '1px solid #ccc',
  borderRadius: '15px',
  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  textAlign: 'center',
};

const logoutButtonStyle = {
  marginTop: '20px',
  padding: '12px 25px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#4CAF50',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
};

export default Profile;
