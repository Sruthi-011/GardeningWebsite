import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        {/* About Section */}
        <div style={sectionStyle}>
          <h3>About Us 🌱</h3>
          <p>
            Welcome to Root & Bloom! We bring you beautiful plants, flowers, and gardening tips. 
            Share your plants, book visits, and shop your favorite greenery online!
          </p>
        </div>

        {/* Contact Section */}
        <div style={sectionStyle}>
          <h3>Contact Us 📞</h3>
          <p><strong>Address:</strong> 123 Green Lane, Garden City, India</p>
          <p><strong>Email:</strong> support@root&bloom.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
        </div>

        {/* Social Media Section */}
        <div style={sectionStyle}>
          <h3>Follow Us 🌸</h3>
          <p>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={socialLink}>Facebook</a> |{' '}
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={socialLink}>Instagram</a> |{' '}
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" style={socialLink}>Twitter</a>
          </p>

        </div>
      </div>

      <p style={copyrightStyle}>
        &copy; {new Date().getFullYear()} Root & Bloom. All rights reserved.
      </p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '30px 20px 10px 20px',
  marginTop: '40px',
  fontFamily: 'Arial, sans-serif',
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  maxWidth: '1200px',
  margin: '0 auto',
};

const sectionStyle = {
  flex: '1 1 250px',
  margin: '10px',
  minWidth: '200px',
};

const socialLink = {
  color: 'white',
  textDecoration: 'none',
};

const copyrightStyle = {
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '0.9em',
  color: '#f0f0f0',
};

export default Footer;
