const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const actionRoutes = require('./routes/actions');
require('dotenv').config();

console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);

const app = express();
app.use(cors({
    origin: ['https://ecotrack.onrender.com', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Add a health check route
app.get('/', (req, res) => {
    res.json({ message: 'EcoTrack API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/actions', actionRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecotrack')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });
