const app = require('./app');
const PORT = process.env.PORT || 5001;
const plantSharingRoutes = require('./routes/plantSharing');
const reviewRoutes = require('./routes/reviews');
const adminProductsRoutes = require('./routes/adminProducts');
const adminVisitRoutes = require("./routes/adminRoutes");
const recommendationRoutes = require('./routes/recommendationRoutes');

app.use('/api/plant-sharing', plantSharingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin/products', adminProductsRoutes);
app.use("/api/admin", adminVisitRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
