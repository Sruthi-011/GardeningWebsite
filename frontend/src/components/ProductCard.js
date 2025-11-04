import React, { useState, useEffect, useCallback } from 'react';

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) return <p>No reviews yet.</p>;
  return (
    <div>
      {reviews.map((r) => (
        <div key={r.id} style={{ borderBottom: '1px solid #ddd', padding: '5px 0' }}>
          <strong>{r.user_name}</strong> ({r.rating}/5): {r.comment}
        </div>
      ))}
    </div>
  );
};

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login to submit review');

    try {
      const res = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, rating, comment })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Review added successfully!');
        setRating(5);
        setComment('');
        onReviewAdded();
      } else {
        alert(data.error || 'Failed to add review');
      }
    } catch (err) {
      console.log(err);
      alert('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
      <label>
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={{ marginLeft: '5px' }}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <br />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        style={{ width: '100%', padding: '5px', marginTop: '5px' }}
        required
      />
      <br />
      <button
        type="submit"
        style={{ ...buttonStyle, backgroundColor: '#4CAF50', marginTop: '5px' }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#45A049')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
      >
        Submit Review
      </button>
    </form>
  );
};

const ProductCard = ({ product }) => {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [hovered, setHovered] = useState(false); // Added for card hover

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${product.id}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.log('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  }, [product.id]);

  useEffect(() => {
    if (showReviews) fetchReviews();
  }, [showReviews, fetchReviews]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please login first to add items to the cart');

    try {
      const res = await fetch('http://localhost:5001/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 })
      });

      const data = await res.json();
      alert(data.message || 'Failed to add to cart');
    } catch (err) {
      console.log(err);
      alert('Error adding to cart');
    }
  };

  const imageUrl = product.image_url.startsWith('/uploads')
    ? `http://localhost:5001${product.image_url}`
    : product.image_url;

  // Card dynamic hover effect
  const dynamicCardStyle = {
    ...cardStyle,
    transform: hovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: hovered
      ? '0 10px 25px rgba(0, 0, 0, 0.25)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: hovered ? '1px solid #4CAF50' : '1px solid #ccc',
  };

  return (
    <div
      style={dynamicCardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {product.is_featured === 1 && <span style={badgeStyle}>🌟 Featured</span>}

      <img src={imageUrl} alt={product.name} style={imageStyle} />
      <h3 style={nameStyle}>{product.name}</h3>
      <p style={descStyle}>{product.description}</p>
      <p style={priceStyle}>₹{product.price}</p>
      <p>
        <strong>Category:</strong> {product.category || 'N/A'}
      </p>
      <p>
        <strong>Season:</strong> {product.season || 'N/A'}
      </p>
      <p>
        <strong>Stock:</strong>{' '}
        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
      </p>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        style={{
          ...buttonStyle,
          backgroundColor: product.stock === 0 ? '#ccc' : '#4CAF50',
        }}
        onMouseEnter={(e) => {
          if (product.stock !== 0) {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.backgroundColor = '#45A049';
          }
        }}
        onMouseLeave={(e) => {
          if (product.stock !== 0) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = '#4CAF50';
          }
        }}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>

      {/* Toggle Reviews Button */}
      <button
        onClick={() => setShowReviews(!showReviews)}
        style={{ ...buttonStyle, backgroundColor: '#2196F3', marginTop: '10px' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = '#1E88E5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#2196F3';
        }}
      >
        {showReviews ? 'Hide Reviews' : 'Add Review / View Reviews'}
      </button>

      {showReviews && (
        <div style={{ marginTop: '10px' }}>
          <h4>🌟 Reviews</h4>
          {loadingReviews ? <p>Loading reviews...</p> : <ReviewList reviews={reviews} />}
          <ReviewForm productId={product.id} onReviewAdded={fetchReviews} />
        </div>
      )}
    </div>
  );
};

// Styles
const cardStyle = {
  border: '1px solid #ccc',
  padding: '15px',
  margin: '10px',
  width: '220px',
  position: 'relative',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '10px',
  transition: 'all 0.3s ease-in-out',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#fff',
};

const badgeStyle = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#FFD700',
  color: '#000',
  padding: '3px 8px',
  borderRadius: '5px',
  fontWeight: 'bold',
  fontSize: '0.8em',
};

const imageStyle = {
  width: '100%',
  height: '160px',
  objectFit: 'cover',
  borderRadius: '5px',
  marginBottom: '10px',
};

const nameStyle = {
  fontSize: '1.1em',
  margin: '5px 0',
  color: '#333',
};

const descStyle = {
  fontSize: '0.9em',
  margin: '5px 0',
  color: '#555',
  minHeight: '40px',
};

const priceStyle = {
  fontWeight: 'bold',
  margin: '5px 0',
  color: '#4CAF50',
};

const buttonStyle = {
  border: 'none',
  padding: '10px',
  width: '100%',
  borderRadius: '5px',
  color: 'white',
  fontWeight: 'bold',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
};

export default ProductCard;
