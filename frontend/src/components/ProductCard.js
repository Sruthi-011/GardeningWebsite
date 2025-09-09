import React from 'react';

const ProductCard = ({ product }) => {
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
      if (data.message) alert(data.message);
      else alert('Failed to add to cart');
    } catch (err) {
      console.log(err);
      alert('Error adding to cart');
    }
  };

  // Ensure the image URL uses the correct full backend path
  const imageUrl = product.image_url.startsWith('/uploads')
    ? `http://localhost:5001${product.image_url}`
    : product.image_url;

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '10px',
        width: '200px',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        transition: 'transform 0.2s'
      }}
    >
      <img
        src={imageUrl}
        alt={product.name}
        style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p><strong>₹{product.price}</strong></p>
      <p><strong>Category:</strong> {product.category || 'N/A'}</p>
      <p><strong>Season:</strong> {product.season || 'N/A'}</p>
      <p>
        <strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
      </p>
      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        style={{
          backgroundColor: product.stock === 0 ? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '10px',
          cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
          borderRadius: '5px'
        }}
      >
        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductCard;
