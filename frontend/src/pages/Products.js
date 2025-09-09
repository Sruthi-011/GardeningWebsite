import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('');
  const [season, setSeason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'http://localhost:5001/api/products';

        if (filter === 'featured') url = 'http://localhost:5001/api/products/featured';
        else if (filter) url = `http://localhost:5001/api/products/category/${filter}`;

        if (season) url += url.includes('?') ? `&season=${season}` : `?season=${season}`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filter, season]);

  const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    transition: 'transform 0.2s',
  };

  const buttonHoverStyle = {
    transform: 'scale(1.05)',
  };

  const [hoveredBtn, setHoveredBtn] = useState(null);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🌼 Our Products 🌿</h2>

      {/* Category Filter */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {['', 'Flower', 'Plant', 'featured'].map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setFilter(cat)}
            style={{
              ...buttonStyle,
              ...(hoveredBtn === idx ? buttonHoverStyle : {}),
              backgroundColor: filter === cat ? '#388E3C' : '#4CAF50',
            }}
            onMouseEnter={() => setHoveredBtn(idx)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Seasonal Filter */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        {['', 'Spring', 'Summer', 'Autumn', 'Winter'].map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSeason(s)}
            style={{
              ...buttonStyle,
              ...(hoveredBtn === idx + 10 ? buttonHoverStyle : {}),
              backgroundColor: season === s ? '#388E3C' : '#4CAF50',
            }}
            onMouseEnter={() => setHoveredBtn(idx + 10)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {s === '' ? 'All Seasons' : s}
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {loading && <p style={{ textAlign: 'center' }}>Loading products...</p>}

      {/* Product Grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          !loading && <p style={{ textAlign: 'center' }}>No products found for selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
