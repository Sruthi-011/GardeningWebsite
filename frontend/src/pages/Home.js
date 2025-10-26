import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { icon: '🚚', title: 'Plant Delivery', desc: 'Fresh plants delivered safely to your doorstep.' },
    { icon: '🌿', title: 'Garden Landscaping', desc: 'Transform your home or office with our experts.' },
    { icon: '🌱', title: 'Eco-friendly Products', desc: 'We offer sustainable plants and accessories.' },
    { icon: '🤝', title: 'Community Sharing', desc: 'Share plants with fellow gardening enthusiasts.' },
    { icon: '🏡', title: 'Visit Booking', desc: 'Plan a visit to our beautiful garden anytime.' },
    { icon: '🛠️', title: 'Gardening Tools', desc: 'Wide variety of high-quality gardening essentials.' },
    { icon: '🌸', title: 'Seasonal Plants', desc: 'Find plants perfect for every season.' },
    { icon: '🧴', title: 'Plant Care Products', desc: 'Everything you need to keep your plants healthy.' },
    { icon: '📦', title: 'Quick Packaging', desc: 'Plants and products packed safely for delivery.' },
    { icon: '🏷️', title: 'Seasonal Discounts', desc: 'Get special offers on plants and accessories.' } 
  ];

  const products = [
    { name: 'Daisy', price: '₹20', img: 'http://localhost:5001/uploads/Daisy.jpeg' },
    { name: 'Peace Lily', price: '₹80', img: 'http://localhost:5001/uploads/Peacelily.jpeg' },
    { name: 'Lavender', price: '₹60', img: 'http://localhost:5001/uploads/Lavender.jpeg' },
    { name: 'Orchid', price: '₹150', img: 'http://localhost:5001/uploads/Orchid.jpeg' }
  ];

  const testimonials = [
    { name: 'Ananya', text: 'Root & Bloom completely changed the way I see gardening. My balcony is now full of life! 🌸' },
    { name: 'Gowtham', text: 'The plant sharing option is amazing. I exchanged two saplings and made gardening friends!' },
    { name: 'Meera', text: 'Superb service and quick delivery. The plants arrived fresh and healthy.' }
  ];

  const stats = [
    { number: '500+', label: 'Plants Sold' },
    { number: '1200+', label: 'Happy Gardeners' },
    { number: '50+', label: 'Workshops Conducted' },
    { number: '100+', label: 'Plant Sharing Stories' }
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>

      {/* Hero Section */}
      <section style={{
        padding: '80px 20px',
        background: 'linear-gradient(to right, #a8e6cf, #dcedc1)',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '3rem',
          color: '#2e7d32',
          marginBottom: '15px',
          letterSpacing: '1px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
        }}>
          Welcome to Root & Bloom 🌱
        </h1>
        <p style={{ fontSize: '1.3rem', maxWidth: '700px', margin: '0 auto 30px' }}>
          Discover beautiful plants, book garden visits, shop accessories, and share with the community!
        </p>
        <div style={{ marginTop: '20px' }}>
          {[
            { to: '/products', text: 'Explore Products', bg: '#388e3c' },
            { to: '/plant-sharing', text: 'Share a Plant', bg: '#00796b' }
          ].map((btn, idx) => (
            <Link
              key={idx}
              to={btn.to}
              style={{
                margin: '0 10px',
                padding: '12px 25px',
                backgroundColor: btn.bg,
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
              }}
            >
              {btn.text}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '60px 20px', textAlign: 'center', lineHeight: '1.8', background: 'linear-gradient(to right, #e0f2f1, #f1f8e9)', borderRadius: '12px', margin: '40px 0' }}>
  <h2 style={{ color: '#2e7d32', fontSize: '2.4rem', marginBottom: '25px', letterSpacing: '1px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>About Us 🌿</h2>
  
  <p style={{ maxWidth: '850px', margin: '0 auto', fontSize: '1.15rem', color: '#444' }}>
    At <strong style={{ color: '#388e3c' }}>Root & Bloom</strong>, gardening is more than just growing plants—it’s about creating beauty, peace, and connection. Whether you’re a beginner 🌱 taking your first steps with indoor plants or an experienced gardener cultivating a lush outdoor space, we’re here to support your journey.
    <br /><br />
    Our platform makes it easy to <strong style={{ color: '#388e3c' }}>buy plants, flowers, and gardening tools</strong> that bring life to your home and garden. But Root & Bloom isn’t just a store—it’s a <strong style={{ color: '#388e3c' }}>community for plant lovers</strong>. Share photos of your plants, tell their stories 📸, and get inspired by fellow garden enthusiasts around the world.
    <br /><br />
    We aim to nurture a place where everyone can <strong style={{ color: '#388e3c' }}>learn, share, and grow together</strong>. From simple houseplants to unique garden gadgets, everything here is carefully curated to make gardening more enjoyable and accessible.
    <br /><br />
    Join us in celebrating the joy of greenery—because when you <span style={{ fontWeight: 'bold', color: '#2e7d32' }}>root with love</span>, you bloom with life 🌸.
  </p>
</section>


      {/* Why Choose Us / Features Section */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f1f8e9', textAlign: 'center' }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2rem', marginBottom: '40px' }}>Why Choose Us?</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          {features.map((item, idx) => (
            <div key={idx} style={{
              flex: '1 1 220px',
              maxWidth: '250px',
              background: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{item.icon}</div>
              <h3 style={{ color: '#2e7d32', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.5' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2rem', marginBottom: '30px' }}>Featured Products 🌸</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {products.map((product, idx) => (
            <div key={idx} style={{
              width: '220px',
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <img src={product.img} alt={product.name} style={{ width: '100%', height: '175px', borderRadius: '10px', marginBottom: '10px', objectFit: 'cover' }} />
              <h3 style={{ color: '#2e7d32', marginBottom: '5px' }}>{product.name}</h3>
              <p style={{ color: '#555', fontWeight: 'bold' }}>{product.price}</p>
              <Link to="/products"
                style={{
                  color: '#388e3c',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  transition: 'transform 0.3s',
                  display: 'inline-block',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                View Product →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#f1f8e9' }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2rem', marginBottom: '30px' }}>What Our Customers Say</h2>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {testimonials.map((review, idx) => (
            <div key={idx} style={{
              width: '280px',
              background: '#f9f9f9',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              fontStyle: 'italic',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              <p>"{review.text}"</p>
              <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#2e7d32' }}>– {review.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Facts / Stats Section */}
      <section style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#e8f5e9' }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2rem', marginBottom: '40px' }}>Fun Facts 🌿</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '30px'
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              width: '180px',
              padding: '25px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)',
              textAlign: 'center',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.1)'; }}
            >
              <h3 style={{ fontSize: '2rem', color: '#388e3c', marginBottom: '10px' }}>{stat.number}</h3>
              <p style={{ color: '#555', fontWeight: 'bold', fontSize: '0.95rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        padding: '60px 20px',
        background: 'linear-gradient(to right, #a5d6a7, #c8e6c9)',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#2e7d32', fontSize: '2rem', marginBottom: '20px' }}>Ready to Grow Your Garden?</h2>
        <Link to="/products"
          style={{
            display: 'inline-block',
            padding: '14px 30px',
            backgroundColor: '#43a047',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s, box-shadow 0.3s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
          }}
        >
          Explore Now
        </Link>
      </section>

    </div>
  );
};

export default Home;
