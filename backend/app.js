const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Import routes
const adminUsersRoutes = require('./routes/adminUsers');
const adminOrdersRoutes = require('./routes/adminOrders');
const productsRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const visitBookingRoute = require('./routes/visitBooking');
const ordersRoute = require('./routes/orders');
const paymentRoute = require('./routes/payment'); // 🪙 Razorpay payment route
const cartRoute = require('./routes/cart');
const plantSharingRoute = require('./routes/plantSharing');

// ✅ Use routes
app.use('/api/admin/users', adminUsersRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);
app.use('/api/products', productsRoute);
app.use('/api/auth', authRoute);
app.use('/api/visit-bookings', visitBookingRoute);
app.use('/api/orders', ordersRoute);
app.use('/api/payment', paymentRoute); // 🪙 Payment route active here
app.use('/api/cart', cartRoute);
app.use('/api/plant-sharing', plantSharingRoute);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('🌱 Gardening Website Backend with Razorpay Payment Integration is Running 🌼');
});

module.exports = app;
