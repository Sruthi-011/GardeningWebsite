import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import VisitBooking from './pages/VisitBooking';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import PlantSharing from './pages/PlantSharing';
import SharePlant from './pages/SharePlant';

function App() {
  return (
    <Router>
      <Navbar />

      {/* Main content */}
      <div style={{ minHeight: 'calc(100vh - 120px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/visit-booking" element={<VisitBooking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/plant-sharing" element={<PlantSharing />} />
          <Route path="/share-plant" element={<SharePlant />} />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
