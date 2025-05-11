require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const swaggerRoutes = require('./routes/swagger');
const campaignRoutes = require('./routes/campaignRoutes');
const segmentRoutes = require('./routes/segmentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('CRM Backend API is running');
});

connectDB();

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api-docs', swaggerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/segments', segmentRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
