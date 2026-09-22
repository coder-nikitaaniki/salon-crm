require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const salonRoutes = require('./routes/salons');
const appointmentRoutes = require('./routes/appointments');
const attendanceRoutes = require('./routes/attendance');
const seedRoutes = require('./routes/seed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/clients', require('./routes/clients'));
app.use('/api/seed', seedRoutes); // For seeding data

app.get('/', (req, res) => {
  res.send('Salon CRM API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
