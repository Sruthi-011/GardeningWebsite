import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ padding: '50px 0', backgroundColor: '#e0f7fa' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2e7d32' }}>
          Welcome to My Gardening Website 🌱
        </h1>
        <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>
          Discover beautiful plants, book garden visits, shop accessories, and share with the community!
        </p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/products" style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#388e3c', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Explore Products
          </Link>
          <Link to="/plant-sharing" style={{ margin: '0 10px', padding: '10px 20px', backgroundColor: '#00796b', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Share a Plant
          </Link>
        </div>
      </section>

      {/* About Us Section */}
      <section style={{ padding: '40px 20px' }}>
        <h2 style={{ color: '#2e7d32' }}>About Us</h2>
        <p style={{ maxWidth: '800px', margin: '10px auto', lineHeight: '1.6' }}>
          We are passionate about making gardening accessible and fun for everyone.  
          Buy flowers, medicinal plants, gardening tools, or book a visit to our garden.  
          You can even share your plants with the community to help green the world together 🌍.
        </p>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '40px 20px', backgroundColor: '#f1f8e9' }}>
        <h2 style={{ color: '#2e7d32' }}>Why Choose Us?</h2>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '20px' }}>
          <div style={{ width: '200px', padding: '10px' }}>
            🌱 <h3>Eco-friendly Products</h3>
            <p>We offer sustainable plants and accessories.</p>
          </div>
          <div style={{ width: '200px', padding: '10px' }}>
            🤝 <h3>Community Sharing</h3>
            <p>Share plants with fellow gardening enthusiasts.</p>
          </div>
          <div style={{ width: '200px', padding: '10px' }}>
            🏡 <h3>Visit Booking</h3>
            <p>Plan a visit to our beautiful garden anytime.</p>
          </div>
          <div style={{ width: '200px', padding: '10px' }}>
            💡 <h3>Expert Tips</h3>
            <p>Get useful gardening tips and advice from experts.</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '40px 20px', backgroundColor: '#c8e6c9' }}>
        <h2 style={{ color: '#2e7d32' }}>Ready to Grow Your Garden?</h2>
        <Link to="/products" style={{ marginTop: '20px', display: 'inline-block', padding: '12px 25px', backgroundColor: '#43a047', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Explore Now
        </Link>
      </section>

    </div>
  );
};

export default Home;
