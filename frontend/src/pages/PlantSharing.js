import React, { useState, useEffect } from 'react';

const PlantSharing = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  // 🌿 Fetch all shared plants
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/plant-sharing');
        const data = await res.json();
        setPlants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching plants:', err);
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // 🔄 Update plant status (for owner only)
  const handleStatusChange = async (plantId, newStatus) => {
    if (!token) {
      alert('Please login to update your plant status.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/plant-sharing/${plantId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Status updated successfully!');
        setPlants((prev) =>
          prev.map((p) => (p.id === plantId ? { ...p, status: newStatus } : p))
        );
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Server error while updating status');
    }
  };

  if (loading) return <p style={loadingStyle}>🌿 Loading shared plants...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🌱 Community Plant Sharing & Swap</h2>
      <p style={subtitleStyle}>
        Connect with other plant lovers! 🌼 Exchange, share, or gift plants to grow a greener world together.
      </p>

      {plants.length === 0 ? (
        <p style={emptyStyle}>No plants shared yet. Be the first to share your plant! 🌿</p>
      ) : (
        <div style={gridStyle}>
          {plants.map((plant) => (
            <div key={plant.id} className="plant-card" style={cardStyle}>
              {plant.image_url && (
                <div style={imageWrapper}>
                  <img
                    src={`http://localhost:5001${plant.image_url}`}
                    alt={plant.plant_name}
                    style={imageStyle}
                  />
                </div>
              )}
              <div style={infoStyle}>
                <h3 style={plantTitle}>{plant.plant_name}</h3>
                <p style={descStyle}>{plant.description || 'No description available.'}</p>

                <div style={metaBox}>
                  <p><strong>🌸 Category:</strong> {plant.category || 'N/A'}</p>
                  <p><strong>📦 Quantity:</strong> {plant.quantity || 1}</p>
                  <p><strong>📍 Location:</strong> {plant.location || 'Not specified'}</p>

                  {/* ✅ Status section */}
                  <p><strong>🔖 Status:</strong>{' '}
                    {userEmail === plant.shared_email ? (
                      <select
                        value={plant.status}
                        onChange={(e) => handleStatusChange(plant.id, e.target.value)}
                        style={dropdownStyle}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="exchanged">Exchanged</option>
                      </select>
                    ) : (
                      <span style={statusStyle(plant.status)}>{plant.status}</span>
                    )}
                  </p>

                  {/* ✅ Contact details */}
                  <p><strong>📞 Contact:</strong> {plant.phone_number ? plant.phone_number : 'Not specified'}</p>
                  <p><strong>👤 Shared by:</strong> {plant.shared_by}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>
                    ⏰ Updated on {new Date(plant.updated_at || plant.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Hover + Responsive Animations */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="display: flex"][style*="wrap"] {
              flex-direction: column;
              align-items: center;
            }
          }

          /* 🌿 Enhanced Card Hover Effect */
          .plant-card {
            transition: transform 0.4s ease, box-shadow 0.4s ease;
            cursor: pointer;
          }

          .plant-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 15px 25px rgba(0, 0, 0, 0.25);
            border-color: #66bb6a;
          }

          .plant-card:hover img {
            transform: scale(1.08);
            filter: brightness(1.05);
          }
        `}
      </style>
    </div>
  );
};

// 🌿 Styles
const containerStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #e8f5e9, #ffffff)',
  padding: '40px 20px',
  fontFamily: "'Poppins', sans-serif",
  textAlign: 'center',
};

const titleStyle = {
  color: '#2e7d32',
  fontSize: '2.2rem',
  marginBottom: '10px',
  textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
};

const subtitleStyle = {
  color: '#555',
  marginBottom: '30px',
  fontSize: '1rem',
  maxWidth: '600px',
  margin: '0 auto 40px',
  lineHeight: '1.6',
};

const loadingStyle = {
  fontSize: '18px',
  color: '#388e3c',
  textAlign: 'center',
  marginTop: '50px',
};

const emptyStyle = {
  fontSize: '16px',
  color: '#666',
  textAlign: 'center',
  marginTop: '30px',
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '12px',
  width: '260px',
  backgroundColor: 'white',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
};

const imageWrapper = {
  overflow: 'hidden',
  height: '160px',
};

const imageStyle = {
  width: '100%',
  height: '160px',
  objectFit: 'cover',
  transition: 'transform 0.4s ease, filter 0.4s ease',
};

const infoStyle = {
  padding: '15px',
  textAlign: 'left',
};

const plantTitle = {
  color: '#2e7d32',
  marginBottom: '8px',
  fontSize: '1.2rem',
};

const descStyle = {
  fontSize: '0.9rem',
  color: '#555',
  marginBottom: '10px',
  minHeight: '40px',
};

const metaBox = {
  background: '#f9f9f9',
  borderRadius: '8px',
  padding: '10px',
  fontSize: '0.9rem',
};

const dropdownStyle = {
  padding: '4px 8px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  backgroundColor: '#f1f8e9',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const statusStyle = (status) => ({
  color:
    status === 'available'
      ? '#2e7d32'
      : status === 'reserved'
      ? '#e65100'
      : status === 'exchanged'
      ? '#1565c0'
      : '#555',
  fontWeight: 'bold',
});

export default PlantSharing;
