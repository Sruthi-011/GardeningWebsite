import React, { useState } from 'react';

const SharePlant = () => {
  const [plantName, setPlantName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('available');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [shareContact, setShareContact] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!plantName.trim()) {
      setMessage('❌ Please enter the plant name');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('plant_name', plantName);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('quantity', quantity);
    formData.append('location', location);
    formData.append('status', status);
    if (image) formData.append('image', image);
    if (shareContact && phoneNumber.trim()) formData.append('phone_number', phoneNumber);

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
        setMessage('🌿 Plant shared successfully!');
        setPlantName('');
        setDescription('');
        setCategory('');
        setQuantity(1);
        setImage(null);
        setLocation('');
        setStatus('available');
        setPhoneNumber('');
        setShareContact(false);
      } else {
        setMessage(data.error || '❌ Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}>
        <h2 style={titleStyle}>🌱 Share a Plant with the Community</h2>
        <p style={subtitleStyle}>
          Upload your plant details so others can exchange, adopt, or share! 🌿
        </p>

        {message && (
          <p
            style={{
              ...messageStyle,
              color: message.startsWith('❌') ? '#e53935' : '#2e7d32',
            }}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" style={formStyle}>
          <InputField label="Plant Name *" value={plantName} onChange={setPlantName} required />
          <InputField label="Description" type="textarea" value={description} onChange={setDescription} />
          <InputField label="Category" value={category} onChange={setCategory} />
          <InputField label="Quantity" type="number" value={quantity} onChange={setQuantity} />
          <InputField label="Location" value={location} onChange={setLocation} placeholder="Enter your area or city" />

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="exchanged">Exchanged</option>
            </select>
          </div>

          {/* Image Upload */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Upload Plant Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              style={fileInputStyle}
            />
          </div>

          {/* Contact Sharing Option */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Would you like to share your contact?</label>
            <div style={radioGroupStyle}>
              <label>
                <input
                  type="radio"
                  name="shareContact"
                  checked={shareContact === true}
                  onChange={() => setShareContact(true)}
                />{' '}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="shareContact"
                  checked={shareContact === false}
                  onChange={() => setShareContact(false)}
                />{' '}
                No
              </label>
            </div>
          </div>

          {/* Phone Number Field */}
          {shareContact && (
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="Enter your contact number"
              value={phoneNumber}
              onChange={setPhoneNumber}
            />
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#388e3c')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#4CAF50')}
          >
            {loading ? 'Sharing...' : 'Share Plant 🌿'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const InputField = ({ label, type = 'text', value, onChange, ...props }) => (
  <div style={inputGroupStyle}>
    <label style={labelStyle}>{label}:</label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
        {...props}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
        {...props}
      />
    )}
  </div>
);

// Inline Styles
const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: "'Poppins', sans-serif",
  backgroundImage: 'url("http://localhost:5001/uploads/Sharing.jpg")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '30px',
};

const overlayStyle = {
  width: '100%',
  maxWidth: '550px',
  backgroundColor: 'rgba(255,255,255,0.95)',
  padding: '35px',
  borderRadius: '18px',
  boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
};

const titleStyle = { textAlign: 'center', color: '#2e7d32', fontSize: '1.9rem', marginBottom: '10px' };
const subtitleStyle = { textAlign: 'center', color: '#555', fontSize: '0.95rem', marginBottom: '25px' };
const formStyle = { display: 'flex', flexDirection: 'column' };
const inputGroupStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '5px', fontWeight: '500', color: '#333' };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' };
const fileInputStyle = { padding: '5px 0' };
const radioGroupStyle = { display: 'flex', gap: '20px', marginTop: '5px' };
const buttonStyle = {
  padding: '12px 0',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: '#4CAF50',
  color: 'white',
  fontWeight: '600',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};
const messageStyle = { textAlign: 'center', fontWeight: '500', marginBottom: '15px' };

export default SharePlant;
