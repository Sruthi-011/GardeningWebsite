const app = require('./app');
const PORT = process.env.PORT || 5001;
const plantSharingRoutes = require('./routes/plantSharing');

// Register the plant sharing routes
app.use('/api/plant-sharing', plantSharingRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
