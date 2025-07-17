const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const { initWhatsApp } = require('./services/whatsapp');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('🟢 ShadowCast Backend is Live');
});

// DB + WhatsApp init + Server Start
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    return initWhatsApp(); // WhatsApp session start
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Startup Error:', err);
  });
