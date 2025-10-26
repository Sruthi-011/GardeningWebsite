import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail'); 
  const adminEmail = "admin@example.com"; 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    alert('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <h2 style={{ margin: 0, fontSize: '1.8rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        🌱 Root & Bloom
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
      }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/products" style={linkStyle}>Products</Link>
        <Link to="/cart" style={linkStyle}>Cart</Link>
        <Link to="/visit-booking" style={linkStyle}>Visit Booking</Link>
        <Link to="/plant-sharing" style={linkStyle}>Plant Sharing</Link>
        {token && <Link to="/share-plant" style={linkStyle}>Share a Plant</Link>}
        {token && <Link to="/orders" style={linkStyle}>Orders</Link>}

        {/* ✅ Admin Dashboard Link */}
        {token && userEmail === adminEmail && (
          <Link to="/admin-dashboard" style={{ ...linkStyle, fontWeight: 'bold', color: '#FFD700' }}>
            👑 Admin Panel
          </Link>
        )}

        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={linkStyle}>Profile</Link>
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  margin: '5px 10px',
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '1rem',
  cursor: 'pointer',
};

const logoutButtonStyle = {
  margin: '5px 10px',
  color: 'white',
  background: 'transparent',
  border: '1px solid white',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '500'
};

export default Navbar;
