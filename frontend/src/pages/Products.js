import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendedCategory, setRecommendedCategory] = useState('');
  const [mainCategory, setMainCategory] = useState('plants');
  const [filter, setFilter] = useState('');
  const [season, setSeason] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5001/api/products?type=${mainCategory}`;
        if (filter) url += `&filter=${filter}`;
        if (season) url += `&season=${season}`;

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
  }, [mainCategory, filter, season]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5001/api/recommendations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
          setRecommendedCategory(data.category || 'Popular Picks');
        }
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      }
    };

    fetchRecommendations();
  }, []);

  const buttonStyle = {
    padding: '10px 15px',
    margin: '5px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    transition: 'all 0.2s ease-in-out',
  };

  const buttonHoverStyle = {
    transform: 'scale(1.08)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🌼 Our Products 🌿</h2>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div
          style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '10px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ color: '#2e7d32', marginBottom: '20px', textAlign: 'center' }}>
            🌱 Recommended for You ({recommendedCategory})
          </h3>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '20px',
            }}
          >
            {recommendations.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Main Category Buttons */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        {['plants', 'gadgets'].map((cat, idx) => (
          <button
            key={idx}
            onClick={() => {
              setMainCategory(cat);
              setFilter('');
              setSeason('');
            }}
            style={{
              ...buttonStyle,
              ...(hoveredBtn === idx ? buttonHoverStyle : {}),
              backgroundColor: mainCategory === cat ? '#388E3C' : '#4CAF50',
            }}
            onMouseEnter={() => setHoveredBtn(idx)}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            {cat === 'plants' ? 'Plants 🌱' : 'Garden Gadgets 🛠️'}
          </button>
        ))}
      </div>

      {/* Filters for Plants */}
      {mainCategory === 'plants' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            {['', 'Flower', 'Plant', 'featured'].map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setFilter(cat)}
                style={{
                  ...buttonStyle,
                  ...(hoveredBtn === idx + 10 ? buttonHoverStyle : {}),
                  backgroundColor: filter === cat ? '#388E3C' : '#4CAF50',
                }}
                onMouseEnter={() => setHoveredBtn(idx + 10)}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {['', 'Spring', 'Summer', 'Autumn', 'Winter'].map((s, idx) => (
              <button
                key={idx}
                onClick={() => setSeason(s)}
                style={{
                  ...buttonStyle,
                  ...(hoveredBtn === idx + 20 ? buttonHoverStyle : {}),
                  backgroundColor: season === s ? '#388E3C' : '#4CAF50',
                }}
                onMouseEnter={() => setHoveredBtn(idx + 20)}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {s === '' ? 'All Seasons' : s}
              </button>
            ))}
          </div>
        </>
      )}

      {loading && <p style={{ textAlign: 'center' }}>Loading products...</p>}

      {/* Products Grid */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {products.length > 0 ? (
          products.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          !loading && (
            <p style={{ textAlign: 'center' }}>No products found for selected filters.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
