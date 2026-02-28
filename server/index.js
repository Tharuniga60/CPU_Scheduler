const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const schedulingRoutes = require('./routes/scheduling');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scheduling', schedulingRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('CPU Scheduling Visualizer API is running...');
});

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cpu_scheduling')
    .then(() => {
        console.log('MongoDB connected successfully');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
