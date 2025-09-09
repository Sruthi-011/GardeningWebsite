import React, { useState, useEffect } from 'react';

const PlantSharing = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/plant-sharing');
        const data = await res.json();
        setPlants(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  if (loading) return <p style={loadingStyle}>Loading shared plants...</p>;

  return (
    <div style={containerStyle}>
      <h2>🌱 Community Plant Sharing / Swap</h2>
      {plants.length === 0 ? (
        <p style={emptyStyle}>No plants shared yet. Be the first to share!</p>
      ) : (
        <div style={gridStyle}>
          {plants.map((plant) => (
            <div key={plant.id} style={cardStyle}>
              {plant.image_url && (
                <img
                  src={`http://localhost:5001${plant.image_url}`}
                  alt={plant.plant_name}
                  style={imageStyle}
                />
              )}
              <div style={infoStyle}>
                <h3>{plant.plant_name}</h3>
                <p>{plant.description}</p>
                <p><strong>Category:</strong> {plant.category}</p>
                <p><strong>Quantity:</strong> {plant.quantity}</p>
                <p><strong>Shared by:</strong> {plant.shared_by}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Responsive & hover effects */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="display: flex"] {
              flex-direction: column;
              align-items: center;
            }
          }
          div[style*="border: 1px solid"] {
            transition: transform 0.3s, box-shadow 0.3s;
          }
          div[style*="border: 1px solid"]:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '30px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
};

const loadingStyle = {
  fontSize: '18px',
  color: '#4CAF50',
};

const emptyStyle = {
  fontSize: '16px',
  color: '#888',
};

const gridStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  marginTop: '20px',
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '10px',
  margin: '10px',
  padding: '10px',
  width: '250px',
  backgroundColor: '#f9f9f9',
  overflow: 'hidden',
};

const imageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '5px',
};

const infoStyle = {
  textAlign: 'left',
  marginTop: '10px',
};

export default PlantSharing;
