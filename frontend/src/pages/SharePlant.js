import React, { useState } from 'react';

const SharePlant = () => {
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!plantName) {
      setMessage('🌱 Plant name is required');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('plant_name', plantName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('quantity', quantity);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5001/api/plant-sharing', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('🌱 Plant shared successfully!');
        setPlantName('');
        setDescription('');
        setCategory('');
        setQuantity(1);
        setImage(null);
      } else {
        setMessage(data.error || '❌ Something went wrong');
      }
    } catch (err) {
      console.log(err);
      setMessage('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Share a Plant 🌿</h2>

      {message && <p style={{ ...messageStyle, color: message.includes('❌') ? '#ff4d4f' : '#4CAF50' }}>{message}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" style={formStyle}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Plant Name <span style={{color: 'red'}}>*</span>:</label>
          <input
            type="text"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={fileInputStyle}
          />
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Sharing...' : 'Share Plant'}
        </button>
      </form>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: '30px 20px',
  maxWidth: '500px',
  margin: '40px auto',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f7f9f7',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#4CAF50',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputGroupStyle = {
  marginBottom: '15px',
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle = {
  marginBottom: '5px',
  fontWeight: '500',
};

const inputStyle = {
  padding: '8px 10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const fileInputStyle = {
  padding: '5px 0',
};

const buttonStyle = {
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor: '#4CAF50',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
};

const messageStyle = {
  textAlign: 'center',
  fontWeight: '500',
  marginBottom: '15px',
};

// Hover effect for button
buttonStyle[':hover'] = {
  backgroundColor: '#45a049',
};

export default SharePlant;
