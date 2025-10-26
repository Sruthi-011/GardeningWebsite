const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const adminUsersRoutes = require('./routes/adminUsers');
app.use('/api/admin/users', adminUsersRoutes);

const adminOrdersRoutes = require('./routes/adminOrders');
app.use('/api/admin/orders', adminOrdersRoutes);

const productsRoute = require('./routes/products');
app.use('/api/products', productsRoute);

const authRoute = require('./routes/auth');
app.use('/api/auth', authRoute);

const visitBookingRoute = require('./routes/visitBooking');
app.use('/api/visit-bookings', visitBookingRoute);

const ordersRoute = require('./routes/orders');
app.use('/api/orders', ordersRoute);

const paymentRoute = require('./routes/payment');
app.use('/api/payment', paymentRoute);

const cartRoute = require('./routes/cart');
app.use('/api/cart', cartRoute);

const plantSharingRoute = require('./routes/plantSharing');
app.use('/api/plant-sharing', plantSharingRoute);

// Test route
app.get('/', (req, res) => {
    res.send('🌱 Gardening Website Backend is Running 🌼');
});

module.exports = app;
